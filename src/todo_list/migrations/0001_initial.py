# Generated by Django 2.2.2 on 2019-06-23 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('ST', 'Short Term'), ('LT', 'Long Term')], max_length=2, verbose_name='type')),
                ('descr', models.CharField(max_length=64, verbose_name='item description')),
            ],
        ),
    ]
