# GROUPOMANIA
Le projet est un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues. Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et a imaginé plusieurs briques pour favoriser les échanges entre collègues. <a href="https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P7/Groupomania_Specs_FR_DWJ_VF.pdf">Voici les fonctionnalités demandés. </a>

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
