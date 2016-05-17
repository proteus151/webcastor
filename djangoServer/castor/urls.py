from django.conf.urls import url

from . import views

urlpatterns = [
               url(r'^$', views.index, name='index'),
               url(r'^init$', views.init, name='init'),
               url(r'^switchports/$', views.switchports, name='switchports'),
               url(r'^switchport/([0-9a-f]+)/$', views.switchport, name='switchport'),
               url(r'^commit$', views.commit, name='commit')
               ]
