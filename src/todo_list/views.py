# from django import template
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
# from django.template.defaulttags import register
from django.urls import reverse

from .models import Item, ItemType


def index(request):
    return(redirect(reverse('todo_list:main')))


def main(request):
    todo_type_value = ItemType.ST.value
    if 'todo_type' in request.GET:
        todo_type_value = request.GET['todo_type']

    todo_types = [tag.value for tag in ItemType]
    context = {
        'current_todo_type': todo_type_value,
        'todo_types': todo_types,
    }
    return(render(request, 'todo_list/main/main.html', context))


def get_items(request):
    todo_type_value = ItemType.ST.value
    if 'todo_type' in request.GET:
        todo_type_value = request.GET['todo_type']

    item_objs = Item.objects.filter(type=ItemType(todo_type_value).name)
    items = [{'id': item_obj.id, 'descr': item_obj.descr}
             for item_obj in item_objs]
    return(JsonResponse({'items': list(items)}))


def create_item(request):
    todo_type_value = request.POST['todo_type']
    item_description = request.POST['item_descr']

    new_item = Item(type=ItemType(todo_type_value).name,
                    descr=item_description)
    new_item.save()

    return(HttpResponse('Successfully created an new item with id: {id}'.
                        format(id=new_item.id)))


def delete_item(request):
    item_id = request.POST['id']

    item_to_delete = Item.objects.get(id=item_id)
    item_to_delete.delete()

    return(HttpResponse('Successfully deleted an item with id: {id}'.
                        format(id=item_id)))
