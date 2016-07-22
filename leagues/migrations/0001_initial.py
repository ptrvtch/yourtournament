# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-07-21 21:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('associations', '0002_auto_20160712_1947'),
    ]

    operations = [
        migrations.CreateModel(
            name='League',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=40)),
                ('description', models.CharField(blank=True, max_length=100)),
                ('asscn', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='associations.Association')),
            ],
            options={
                'ordering': ('name',),
            },
        ),
    ]