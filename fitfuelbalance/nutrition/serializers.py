from rest_framework import serializers
from .models import *

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'
        
class IngredientSerializer(serializers.ModelSerializer):
    food = serializers.PrimaryKeyRelatedField(queryset=Food.objects.all())
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = Ingredient
        fields = '__all__'
        
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other
    
class IngredientQuantitySerializer(serializers.Serializer):
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    quantity = serializers.IntegerField()
    
class DishIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DishIngredient
        fields = ['ingredient', 'quantity']
    
class DishSerializer(serializers.ModelSerializer):
    ingredients = IngredientQuantitySerializer(many=True, write_only=True)
    ingredients_details = DishIngredientSerializer(source='dishingredient_set', many=True, read_only=True)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = Dish
        fields = '__all__'
        
    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        dish = Dish.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            DishIngredient.objects.create(
                dish=dish, 
                ingredient=ingredient_data['ingredient'], 
                quantity=ingredient_data['quantity']
            )
        return dish

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        instance.name = validated_data.get('name', instance.name)
        # Actualiza otros campos de Dish según sea necesario

        if ingredients_data is not None:
            # Aquí asumimos que quieres reemplazar completamente los ingredientes existentes.
            # Ajusta la lógica según tus necesidades específicas.
            instance.dishingredient_set.all().delete()  # Elimina las relaciones de ingredientes existentes
            for ingredient_data in ingredients_data:
                DishIngredient.objects.create(
                    dish=instance, 
                    ingredient=ingredient_data['ingredient'], 
                    quantity=ingredient_data['quantity']
                )

        instance.save()
        return instance

    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other

class MealDishSerializer(serializers.ModelSerializer):
    dish_name = serializers.ReadOnlyField(source='dish.name')
    class Meta:
        model = MealDish
        fields = ['dish', 'portion', 'notes', 'dish_name']

class MealSerializer(serializers.ModelSerializer):
    dishes_data = MealDishSerializer(source='mealdish_set', many=True, read_only=False)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = Meal
        fields = '__all__'
        
    def create(self, validated_data):
        dishes_data = validated_data.pop('mealdish_set')
        meal = Meal.objects.create(**validated_data)
        for dish_data in dishes_data:
            MealDish.objects.create(meal=meal, **dish_data)
        return meal

    def update(self, instance, validated_data):
        dishes_data = validated_data.pop('mealdish_set', None)
        instance.name = validated_data.get('name', instance.name)

        if dishes_data is not None:
            # Aquí puedes decidir si quieres borrar todos los MealDish existentes y crear nuevos,
            # o actualizar los existentes de manera más sofisticada.
            instance.mealdish_set.all().delete()
            for dish_data in dishes_data:
                MealDish.objects.create(meal=instance, **dish_data)

        instance.save()
        return instance
        
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other
    
class DailyDietSerializer(serializers.ModelSerializer):
    meals = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all(), many=True)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = DailyDiet
        fields = '__all__'
        
    def create(self, validated_data):
        meals_data = validated_data.pop('meal_set')
        daily_diet = DailyDiet.objects.create(**validated_data)
        for meal_data in meals_data:
            Meal.objects.create(daily_diet=daily_diet, **meal_data)
        return daily_diet

    def update(self, instance, validated_data):
        meals_data = validated_data.pop('meals', None)
        instance.meals.clear()
        if meals_data is not None:
            for meal_data in meals_data:
                instance.meals.add(meal_data)
        instance.save()
        return instance

        
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other

from django.db.models import Q

class DietSerializer(serializers.ModelSerializer):
    daily_diets = DailyDietSerializer(source='dailydiet_set', many=True, read_only=True)
    
    class Meta:
        model = Diet
        fields = '__all__'
        
    def create(self, validated_data):
        diet = Diet.objects.create(**validated_data)
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        date = start_date
        while date <= end_date:
            if not DailyDiet.objects.filter(Q(diet=diet) & Q(date=date)).exists():
                DailyDiet.objects.create(diet=diet, date=date)
            date += timedelta(days=1)
        return diet

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.save()
        return instance
    
    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("start_date must be before end_date")
        return data