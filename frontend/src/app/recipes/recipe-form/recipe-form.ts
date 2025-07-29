import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe';

@Component({
  selector: 'app-recipe-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css'
})
export class RecipeForm implements OnInit {
  recipeForm: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  recipeId: string | null = null;

  difficulties = ['Easy', 'Medium', 'Hard'];
  categories = [
    'Cakes',
    'Cookies',
    'Pastries',
    'Bread',
    'Desserts',
    'Candies',
    'Beverages',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {
    this.recipeForm = this.createForm();
  }

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.recipeId;

    if (this.isEditMode && this.recipeId) {
      this.loadRecipe(this.recipeId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      difficulty: ['', Validators.required],
      prepTime: [0, [Validators.required, Validators.min(1)]],
      cookTime: [0, [Validators.required, Validators.min(1)]],
      servings: [1, [Validators.required, Validators.min(1)]],
      imageUrl: [''],
      ingredients: this.fb.array([this.createIngredientControl()]),
      instructions: this.fb.array([this.createInstructionControl()])
    });
  }

  createIngredientControl(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  createInstructionControl(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required]
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientControl());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addInstruction(): void {
    this.instructions.push(this.createInstructionControl());
  }

  removeInstruction(index: number): void {
    if (this.instructions.length > 1) {
      this.instructions.removeAt(index);
    }
  }

  loadRecipe(id: string): void {
    this.loading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.populateForm(recipe);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load recipe';
        this.loading = false;
      }
    });
  }

  populateForm(recipe: Recipe): void {
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      difficulty: recipe.difficulty,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
      servings: recipe.servings,
      imageUrl: recipe.imageUrl || ''
    });

    // Clear existing arrays
    while (this.ingredients.length !== 0) {
      this.ingredients.removeAt(0);
    }
    while (this.instructions.length !== 0) {
      this.instructions.removeAt(0);
    }

    // Add ingredients
    recipe.ingredients.forEach(ingredient => {
      this.ingredients.push(this.fb.group({
        value: [ingredient, Validators.required]
      }));
    });

    // Add instructions
    recipe.instructions.forEach(instruction => {
      this.instructions.push(this.fb.group({
        value: [instruction, Validators.required]
      }));
    });
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.recipeForm.value;
      const recipeData = {
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        difficulty: formValue.difficulty,
        prepTime: formValue.prepTime,
        cookTime: formValue.cookTime,
        servings: formValue.servings,
        imageUrl: formValue.imageUrl || undefined,
        ingredients: formValue.ingredients.map((ing: any) => ing.value),
        instructions: formValue.instructions.map((inst: any) => inst.value)
      };

      const operation = this.isEditMode
        ? this.recipeService.updateRecipe(this.recipeId!, recipeData)
        : this.recipeService.createRecipe(recipeData);

      operation.subscribe({
        next: (recipe) => {
          this.router.navigate(['/recipes/detail', recipe.id]);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to save recipe';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.recipeForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.recipeId) {
      this.router.navigate(['/recipes/detail', this.recipeId]);
    } else {
      this.router.navigate(['/recipes']);
    }
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.recipeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.recipeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} must be at least 1`;
    }
    return '';
  }

  isIngredientInvalid(index: number): boolean {
    const ingredient = this.ingredients.at(index);
    return !!(ingredient && ingredient.invalid && (ingredient.dirty || ingredient.touched));
  }

  isInstructionInvalid(index: number): boolean {
    const instruction = this.instructions.at(index);
    return !!(instruction && instruction.invalid && (instruction.dirty || instruction.touched));
  }
}
