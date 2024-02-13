from collections.abc import Sequence
from django.contrib import admin
from django.http.request import HttpRequest
from .models import *

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit_weight', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)
    
@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'food', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)
    
@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_ingredients','calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)
    
    def display_ingredients(self, obj):
        return ", ".join([ingredient.name for ingredient in obj.ingredients.all()])

    display_ingredients.short_description = 'Ingredients'
    
@admin.register(DishIngredient)
class DishIngredientAdmin(admin.ModelAdmin):
    list_display = ('dish', 'ingredient', 'quantity')
    search_fields = ('dish__name', 'ingredient__name')
    
@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('name', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)

@admin.register(MealDish)
class MealDishAdmin(admin.ModelAdmin):
    list_display = ('meal', 'dish', 'portion', 'notes')
    search_fields = ('meal__name', 'dish__name')