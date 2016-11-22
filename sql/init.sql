# initialize a blank database and users
# should reset passwords to a random value after running this script
# must be run as an existing database user with appropriate permissions

drop database if exists `redtail`;
create database `redtail`;

# application "super user"
grant all on `redtail`.* to 'redtail'@'localhost' identified by 'password';
