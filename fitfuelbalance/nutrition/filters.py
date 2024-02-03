# nutrition/filters.py

import django_filters
from .models import Food
from django import forms
import django_filters
from .models import Food

class FoodFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    unit_weight = django_filters.RangeFilter()
    calories = django_filters.RangeFilter()
    protein = django_filters.RangeFilter()
    carbohydrates = django_filters.RangeFilter()
    sugar = django_filters.RangeFilter()
    fiber = django_filters.RangeFilter()
    fat = django_filters.RangeFilter()
    saturated_fat = django_filters.RangeFilter()
    gluten_free = django_filters.BooleanFilter()
    lactose_free = django_filters.BooleanFilter()
    vegan = django_filters.BooleanFilter()
    vegetarian = django_filters.BooleanFilter()
    pescetarian = django_filters.BooleanFilter()
    contains_meat = django_filters.BooleanFilter()
    contains_vegetables = django_filters.BooleanFilter()
    contains_fish_shellfish_canned_preserved = django_filters.BooleanFilter()
    cereal = django_filters.BooleanFilter()
    pasta_or_rice = django_filters.BooleanFilter()
    dairy_yogurt_cheese = django_filters.BooleanFilter()
    fruit = django_filters.BooleanFilter()
    nuts = django_filters.BooleanFilter()
    legume = django_filters.BooleanFilter()
    sauce_or_condiment = django_filters.BooleanFilter()
    deli_meat = django_filters.BooleanFilter()
    bread_or_toast = django_filters.BooleanFilter()
    egg = django_filters.BooleanFilter()
    special_drink_or_supplement = django_filters.BooleanFilter()
    tuber = django_filters.BooleanFilter()
    other = django_filters.BooleanFilter()

    class Meta:
        model = Food
        fields = {
            'name': ['icontains'],
            'unit_weight': ['lt', 'gt'],
            'calories': ['lt', 'gt'],
            'protein': ['lt', 'gt'],
            'carbohydrates': ['lt', 'gt'],
            'sugar': ['lt', 'gt'],
            'fiber': ['lt', 'gt'],
            'fat': ['lt', 'gt'],
            'saturated_fat': ['lt', 'gt'],
            'gluten_free': ['exact'],
            'lactose_free': ['exact'],
            'vegan': ['exact'],
            'vegetarian': ['exact'],
            'pescetarian': ['exact'],
            'contains_meat': ['exact'],
            'contains_vegetables': ['exact'],
            'contains_fish_shellfish_canned_preserved': ['exact'],
            'cereal': ['exact'],
            'pasta_or_rice': ['exact'],
            'dairy_yogurt_cheese': ['exact'],
            'fruit': ['exact'],
            'nuts': ['exact'],
            'legume': ['exact'],
            'sauce_or_condiment': ['exact'],
            'deli_meat': ['exact'],
            'bread_or_toast': ['exact'],
            'egg': ['exact'],
            'special_drink_or_supplement': ['exact'],
            'tuber': ['exact'],
            'other': ['exact'],
        }
