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
    
class DishIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DishIngredient
        fields = ['ingredient', 'quantity']
    
class DishSerializer(serializers.ModelSerializer):
    dish_ingredients = DishIngredientSerializer(source='dishingredient_set', many=True)
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
        ingredients_data = validated_data.pop('dishingredient_set')
        dish = Dish.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            DishIngredient.objects.create(dish=dish, **ingredient_data)
        return dish

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('dishingredient_set', [])

        # Actualiza los atributos del Dish
        if 'name' in validated_data:
            instance.name = validated_data['name']
        # Añade aquí otros campos de Dish que puedan necesitar actualización
        instance.save()

        # Primero, eliminar todos los DishIngredient existentes para este Dish
        # Esto es opcional y depende de cómo quieras manejar la actualización
        # Si prefieres actualizar los existentes en lugar de reemplazarlos, necesitarás una lógica más compleja
        instance.dishingredient_set.all().delete()

        # Crea o actualiza DishIngredient
        for ingredient_data in ingredients_data:
            ingredient_id = ingredient_data.get('ingredient').get('id')
            quantity = ingredient_data.get('quantity')

            # Aquí asumimos que quieres crear nuevos DishIngredient cada vez
            # Si prefieres actualizar, necesitarías buscar DishIngredient existentes y actualizarlos
            DishIngredient.objects.create(
                dish=instance,
                ingredient_id=ingredient_id,
                quantity=quantity
            )

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

class MealSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(many=True, read_only=True)
    existing_dishes = serializers.ListField(write_only=True, required=False)
    new_dishes = DishSerializer(many=True, required=False, write_only=True)
    
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
        fields = ['id', 'dishes', 'user', 'name', 'date', 'existing_dishes', 'new_dishes', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other']
        extra_kwargs = {'existing_dishes': {'required': False}, 'new_dishes': {'required': False}}
        
    def create(self, validated_data):
        dishes_data = validated_data.pop('dishes_data', [])
        meal = Meal.objects.create(**validated_data)

        for dish_data in dishes_data:
            if "id" in dish_data:
                # Manejar platos existentes
                dish_id = dish_data.get('id')
                portion = dish_data.get('portion', 1)  # Asume un valor predeterminado si es necesario
                notes = dish_data.get('notes', '')
                dish = Dish.objects.get(pk=dish_id)
                MealDish.objects.create(meal=meal, dish=dish, portion=portion, notes=notes)
            else:
                # Crear nuevos platos
                dish_serializer = DishSerializer(data=dish_data)
                if dish_serializer.is_valid(raise_exception=True):
                    new_dish = dish_serializer.save(user=validated_data['user'])  # Asume que el usuario es parte de validated_data
                    portion = dish_data.get('portion', 1)
                    notes = dish_data.get('notes', '')
                    MealDish.objects.create(meal=meal, dish=new_dish, portion=portion, notes=notes)

        return meal

    def update(self, instance, validated_data):
        meal_dishes_data = validated_data.pop('mealdish_set', [])
        instance.name = validated_data.get('name', instance.name)
        instance.date = validated_data.get('date', instance.date)
        instance.user = validated_data.get('user', instance.user)
        instance.save()

        # Actualizar o crear nuevos MealDish según sea necesario
        # Esto puede requerir una lógica más compleja si necesitas actualizar en lugar de reemplazar

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
    class Meta:
        model = MealDish
        fields = ['dish', 'portion', 'notes']