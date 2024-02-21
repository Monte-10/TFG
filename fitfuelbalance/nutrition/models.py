from django.db import models

class Food(models.Model):
    name = models.CharField(max_length=100, default='')
    unit_weight = models.FloatField(default=0)
    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    carbohydrates = models.FloatField(default=0)
    sugar = models.FloatField(default=0)
    fiber = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    saturated_fat = models.FloatField(default=0)
    gluten_free = models.BooleanField(default=False)
    lactose_free = models.BooleanField(default=False)
    vegan = models.BooleanField(default=False)
    vegetarian = models.BooleanField(default=False)
    pescetarian = models.BooleanField(default=False)
    contains_meat = models.BooleanField(default=False)
    contains_vegetables = models.BooleanField(default=False)
    contains_fish_shellfish_canned_preserved = models.BooleanField(default=False)
    cereal = models.BooleanField(default=False)
    pasta_or_rice = models.BooleanField(default=False)
    dairy_yogurt_cheese = models.BooleanField(default=False)
    fruit = models.BooleanField(default=False)
    nuts = models.BooleanField(default=False)
    legume = models.BooleanField(default=False)
    sauce_or_condiment = models.BooleanField(default=False)
    deli_meat = models.BooleanField(default=False)
    bread_or_toast = models.BooleanField(default=False)
    egg = models.BooleanField(default=False)
    special_drink_or_supplement = models.BooleanField(default=False)
    tuber = models.BooleanField(default=False)
    other = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.FloatField(default=0)
    
    @property
    def calories(self):
        return self.food.calories * self.quantity / 100
    
    @property
    def protein(self):
        return self.food.protein * self.quantity / 100
    
    @property
    def carbohydrates(self):
        return self.food.carbohydrates * self.quantity / 100
    
    @property
    def sugar(self):
        return self.food.sugar * self.quantity / 100
    
    @property
    def fiber(self):
        return self.food.fiber * self.quantity / 100
    
    @property
    def fat(self):
        return self.food.fat * self.quantity / 100
    
    @property
    def saturated_fat(self):
        return self.food.saturated_fat * self.quantity / 100
    
    @property
    def gluten_free(self):
        return self.food.gluten_free
    
    @property
    def lactose_free(self):
        return self.food.lactose_free
    
    @property
    def vegan(self):
        return self.food.vegan
    
    @property
    def vegetarian(self):
        return self.food.vegetarian
    
    @property
    def pescetarian(self):
        return self.food.pescetarian
    
    @property
    def contains_meat(self):
        return self.food.contains_meat
    
    @property
    def contains_vegetables(self):
        return self.food.contains_vegetables
    
    @property
    def contains_fish_shellfish_canned_preserved(self):
        return self.food.contains_fish_shellfish_canned_preserved
    
    @property
    def cereal(self):
        return self.food.cereal
    
    @property
    def pasta_or_rice(self):
        return self.food.pasta_or_rice
    
    @property
    def dairy_yogurt_cheese(self):
        return self.food.dairy_yogurt_cheese
    
    @property
    def fruit(self):
        return self.food.fruit
    
    @property
    def nuts(self):
        return self.food.nuts
    
    @property
    def legume(self):
        return self.food.legume
    
    @property
    def sauce_or_condiment(self):
        return self.food.sauce_or_condiment
    
    @property
    def deli_meat(self):
        return self.food.deli_meat
    
    @property
    def bread_or_toast(self):
        return self.food.bread_or_toast
    
    @property
    def egg(self):
        return self.food.egg
    
    @property
    def special_drink_or_supplement(self):
        return self.food.special_drink_or_supplement
    
    @property
    def tuber(self):
        return self.food.tuber
    
    @property
    def other(self):
        return self.food.other
    
    def __str__(self):
        return str(self.name)
    
class Dish(models.Model):
    user = models.ForeignKey('user.RegularUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    ingredients = models.ManyToManyField(Ingredient, through='DishIngredient')
    
    @property
    def calories(self):
        return sum([ingredient.calories for ingredient in self.ingredients.all()])
    
    @property
    def protein(self):
        return sum([ingredient.protein for ingredient in self.ingredients.all()])
    
    @property
    def carbohydrates(self):
        return sum([ingredient.carbohydrates for ingredient in self.ingredients.all()])
    
    @property
    def sugar(self):
        return sum([ingredient.sugar for ingredient in self.ingredients.all()])
    
    @property
    def fiber(self):
        return sum([ingredient.fiber for ingredient in self.ingredients.all()])
    
    @property
    def fat(self):
        return sum([ingredient.fat for ingredient in self.ingredients.all()])
    
    @property
    def saturated_fat(self):
        return sum([ingredient.saturated_fat for ingredient in self.ingredients.all()])
    
    @property
    def gluten_free(self):
        return all([ingredient.gluten_free for ingredient in self.ingredients.all()])
    
    @property
    def lactose_free(self):
        return all([ingredient.lactose_free for ingredient in self.ingredients.all()])
    
    @property
    def vegan(self):
        return all([ingredient.vegan for ingredient in self.ingredients.all()])
    
    @property
    def vegetarian(self):
        return all([ingredient.vegetarian for ingredient in self.ingredients.all()])
    
    @property
    def pescetarian(self):
        return all([ingredient.pescetarian for ingredient in self.ingredients.all()])
    
    @property
    def contains_meat(self):
        return any([ingredient.contains_meat for ingredient in self.ingredients.all()])
    
    @property
    def contains_vegetables(self):
        return any([ingredient.contains_vegetables for ingredient in self.ingredients.all()])
    
    @property
    def contains_fish_shellfish_canned_preserved(self):
        return any([ingredient.contains_fish_shellfish_canned_preserved for ingredient in self.ingredients.all()])
    
    @property
    def cereal(self):
        return any([ingredient.cereal for ingredient in self.ingredients.all()])
    
    @property
    def pasta_or_rice(self):
        return any([ingredient.pasta_or_rice for ingredient in self.ingredients.all()])
    
    @property
    def dairy_yogurt_cheese(self):
        return any([ingredient.dairy_yogurt_cheese for ingredient in self.ingredients.all()])
    
    @property
    def fruit(self):
        return any([ingredient.fruit for ingredient in self.ingredients.all()])
    
    @property
    def nuts(self):
        return any([ingredient.nuts for ingredient in self.ingredients.all()])
    
    @property
    def legume(self):
        return any([ingredient.legume for ingredient in self.ingredients.all()])
    
    @property
    def sauce_or_condiment(self):
        return any([ingredient.sauce_or_condiment for ingredient in self.ingredients.all()])
    
    @property
    def deli_meat(self):
        return any([ingredient.deli_meat for ingredient in self.ingredients.all()])
    
    @property
    def bread_or_toast(self):
        return any([ingredient.bread_or_toast for ingredient in self.ingredients.all()])
    
    @property
    def egg(self):
        return any([ingredient.egg for ingredient in self.ingredients.all()])
    
    @property
    def special_drink_or_supplement(self):
        return any([ingredient.special_drink_or_supplement for ingredient in self.ingredients.all()])
    
    @property
    def tuber(self):
        return any([ingredient.tuber for ingredient in self.ingredients.all()])
    
    @property
    def other(self):
        return any([ingredient.other for ingredient in self.ingredients.all()])
    
    def __str__(self):
        return str(self.name)

class DishIngredient(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=5, decimal_places=2)

class Meal(models.Model):
    user = models.ForeignKey('user.RegularUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    dishes = models.ManyToManyField(Dish, through='MealDish')
    
    @property
    def calories(self):
        return sum([dish.calories for dish in self.dishes.all()])
    
    @property
    def protein(self):
        return sum([dish.protein for dish in self.dishes.all()])
    
    @property
    def carbohydrates(self):
        return sum([dish.carbohydrates for dish in self.dishes.all()])
    
    @property
    def sugar(self):
        return sum([dish.sugar for dish in self.dishes.all()])
    
    @property
    def fiber(self):
        return sum([dish.fiber for dish in self.dishes.all()])
    
    @property
    def fat(self):
        return sum([dish.fat for dish in self.dishes.all()])
    
    @property
    def saturated_fat(self):
        return sum([dish.saturated_fat for dish in self.dishes.all()])
    
    @property
    def gluten_free(self):
        return all([dish.gluten_free for dish in self.dishes.all()])
    
    @property
    def lactose_free(self):
        return all([dish.lactose_free for dish in self.dishes.all()])
    
    @property
    def vegan(self):
        return all([dish.vegan for dish in self.dishes.all()])
    
    @property
    def vegetarian(self):
        return all([dish.vegetarian for dish in self.dishes.all()])
    
    @property
    def pescetarian(self):
        return all([dish.pescetarian for dish in self.dishes.all()])
    
    @property
    def contains_meat(self):
        return any([dish.contains_meat for dish in self.dishes.all()])
    
    @property
    def contains_vegetables(self):
        return any([dish.contains_vegetables for dish in self.dishes.all()])
    
    @property
    def contains_fish_shellfish_canned_preserved(self):
        return any([dish.contains_fish_shellfish_canned_preserved for dish in self.dishes.all()])
    
    @property
    def cereal(self):
        return any([dish.cereal for dish in self.dishes.all()])
    
    @property
    def pasta_or_rice(self):
        return any([dish.pasta_or_rice for dish in self.dishes.all()])
    
    @property
    def dairy_yogurt_cheese(self):
        return any([dish.dairy_yogurt_cheese for dish in self.dishes.all()])
    
    @property
    def fruit(self):
        return any([dish.fruit for dish in self.dishes.all()])
    
    @property
    def nuts(self):
        return any([dish.nuts for dish in self.dishes.all()])
    
    @property
    def legume(self):
        return any([dish.legume for dish in self.dishes.all()])
    
    @property
    def sauce_or_condiment(self):
        return any([dish.sauce_or_condiment for dish in self.dishes.all()])
    
    @property
    def deli_meat(self):
        return any([dish.deli_meat for dish in self.dishes.all()])
    
    @property
    def bread_or_toast(self):
        return any([dish.bread_or_toast for dish in self.dishes.all()])
    
    @property
    def egg(self):
        return any([dish.egg for dish in self.dishes.all()])
    
    @property
    def special_drink_or_supplement(self):
        return any([dish.special_drink_or_supplement for dish in self.dishes.all()])
    
    @property
    def tuber(self):
        return any([dish.tuber for dish in self.dishes.all()])
    
    @property
    def other(self):
        return any([dish.other for dish in self.dishes.all()])

class MealDish(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    portion = models.DecimalField(max_digits=5, decimal_places=2)
    notes = models.TextField(blank=True,null=True)
    
    class Meta:
        unique_together = ('meal', 'dish')
    
from datetime import timedelta

class Diet(models.Model):
    user = models.ForeignKey('user.RegularUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name
    
    @property
    def duration(self):
        return (self.end_date - self.start_date).days + 1

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super(Diet, self).save(*args, **kwargs)
        if is_new:
            self.generate_daily_diets()

    def generate_daily_diets(self):
        date = self.start_date
        while date <= self.end_date:
            DailyDiet.objects.create(diet=self, date=date)
            date += timedelta(days=1)

    
class DailyDiet(models.Model):
    diet = models.ForeignKey(Diet, on_delete=models.CASCADE)
    date = models.DateField()
    meals = models.ManyToManyField(Meal)
    
    @property
    def calories(self):
        return sum([meal.calories for meal in self.meals.all()])
    
    @property
    def protein(self):
        return sum([meal.protein for meal in self.meals.all()])
    
    @property
    def carbohydrates(self):
        return sum([meal.carbohydrates for meal in self.meals.all()])
    
    @property
    def sugar(self):
        return sum([meal.sugar for meal in self.meals.all()])
    
    @property
    def fiber(self):
        return sum([meal.fiber for meal in self.meals.all()])
    
    @property
    def fat(self):
        return sum([meal.fat for meal in self.meals.all()])
    
    @property
    def saturated_fat(self):
        return sum([meal.saturated_fat for meal in self.meals.all()])
    
    @property
    def gluten_free(self):
        return all([meal.gluten_free for meal in self.meals.all()])
    
    @property
    def lactose_free(self):
        return all([meal.lactose_free for meal in self.meals.all()])
    
    @property
    def vegan(self):
        return all([meal.vegan for meal in self.meals.all()])
    
    @property
    def vegetarian(self):
        return all([meal.vegetarian for meal in self.meals.all()])
    
    @property
    def pescetarian(self):
        return all([meal.pescetarian for meal in self.meals.all()])
    
    @property
    def contains_meat(self):
        return any([meal.contains_meat for meal in self.meals.all()])
    
    @property
    def contains_vegetables(self):
        return any([meal.contains_vegetables for meal in self.meals.all()])
    
    @property
    def contains_fish_shellfish_canned_preserved(self):
        return any([meal.contains_fish_shellfish_canned_preserved for meal in self.meals.all()])
    
    @property
    def canned_or_preserved(self):
        return any([meal.canned_or_preserved for meal in self.meals.all()])
    
    @property
    def cereal(self):
        return any([meal.cereal for meal in self.meals.all()])
    
    @property
    def pasta_or_rice(self):
        return any([meal.pasta_or_rice for meal in self.meals.all()])
    
    @property
    def dairy_yogurt_cheese(self):
        return any([meal.dairy_yogurt_cheese for meal in self.meals.all()])
    
    @property
    def fruit(self):
        return any([meal.fruit for meal in self.meals.all()])
    
    @property
    def nuts(self):
        return any([meal.nuts for meal in self.meals.all()])
    
    @property
    def legume(self):
        return any([meal.legume for meal in self.meals.all()])
    
    @property
    def sauce_or_condiment(self):
        return any([meal.sauce_or_condiment for meal in self.meals.all()])
    
    @property
    def deli_meat(self):
        return any([meal.deli_meat for meal in self.meals.all()])
    
    @property
    def bread_or_toast(self):
        return any([meal.bread_or_toast for meal in self.meals.all()])
    
    @property
    def egg(self):
        return any([meal.egg for meal in self.meals.all()])
    
    @property
    def special_drink_or_supplement(self):
        return any([meal.special_drink_or_supplement for meal in self.meals.all()])
    
    @property
    def tuber(self):
        return any([meal.tuber for meal in self.meals.all()])
    
    @property
    def other(self):
        return any([meal.other for meal in self.meals.all()])
    
    class Meta:
        unique_together = ('diet', 'date')
    
    def __str__(self):
        return f"Dieta para el día {self.date}"
    
