# GROUPOMANIA

## INSTRUCTIONS 

* Il vous faudra avoir installé sur votre machine:
    * Node.js
    * MySQL

## DANS LE DOSSIER BACKEND

- Ouvrez le fichier " .env " : vous devez assigner des valeurs aux 3 variables suivantes:

```bash
DB_USER = 
DB_PASS =
DB_NAME = 
```

## MySQL

Pour ma part, J'ai décidé de passer par Wampserver et phpMyadmin pour facilité l'installation. (root/"" sont les identifiants par défaut)

Sinon:

- Ouvrez un deuxième terminal.

- Connectez-vous à mysql.

- Dans les settings de votre ordinateur, assurez vous qu'une instance MySQL soit bien active.

- Importez le fichier " initialisationBdd.sql "

```bash
mysql> source (chemin vers le fichier initialisationBdd.sql)
```


- Ouvrez un troisième terminal (assurez vous de bien être dans le dossier backend)

- Puis faites:

```bash
npm install
```
- puis une fois l'installation terminée:

```bash
nodemon serv
```
