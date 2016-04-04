# django_template
A template django project

If "vagrant up" fails, try "ulimit -n 4048;vagrant up;". Might start working after that.
https://github.com/mitchellh/vagrant/issues/2435 and http://stackoverflow.com/questions/18808540/error-when-running-vagrant-up-too-many-open-files-getcwd-errnoemfile have some insight, but not much.


Initial creds are admin/admin. host machine http://192.168.50.4/admin/ and http://192.168.50.4/welcome/ can be visited after vagrant up.


To query cigar shops by lat, long, and distance in miles do:
http://192.168.50.4/api/v1/cigarshop/?lat=37.067922&long=-75.130205&distance=10&format=json


If you modified stuff and wanna see it show up do
```
vagrant ssh
sudo su - dtuser
sg dtowners
source /opt/django_template/venv/bin/activate
cd /opt/django_template/code
fab vagrant refresh_local
```
and
```
vagrant ssh
sudo su - dtsudo
sg dtowners
source /opt/django_template/venv/bin/activate
cd /opt/django_template/code
fab vagrant sudo_refresh_local
```

## Advanced


Fixture test_user password is testing123


Example run_list invocation
```
python manage.py run_list '/home/dtuser/Desktop/latest_meetings.txt' '/opt/django_template/code/reports/load_meetings_err.txt' '/opt/django_template/code/reports/load_meetings_err_detail.txt'
```

Invoke seleniums with:
```
fab vagrant_selenium refresh_local
fab sudo_prepare_for_selenium
fab vagrant_selenium run_selenium_tests
```
