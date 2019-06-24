from django.urls import path

from . import views


app_name = 'todo_list'

urlpatterns = [
    path('', views.index, name='index'),
    path('main', views.main, name='main'),
]

urlpatterns += [
    path('ajax/get_items', views.get_items, name='ajax_get_items'),
    path('ajax/create_item', views.create_item, name='ajax_create_item'),
    path('ajax/delete_item', views.delete_item, name='ajax_delete_item'),
]
