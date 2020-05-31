use pokemon_world_war;
SHOW TABLES;

------------------------------ Natures --------------------------------------
CREATE TABLE natureTable (
    natureId INT NOT NULL AUTO_INCREMENT,
    natureName VARCHAR(30) NOT NULL,
    PRIMARY KEY (natureId)
)

INSERT INTO natureTable (natureName) VALUES
    ('Adamant'), ('Bashful'),('Bold'), ('Brave'),
    ('Calm'), ('Careful'),('Docile'), ('Gentle'),
    ('Hardy'), ('Hasty'),('Impish'), ('Jolly'),
    ('Lax'), ('Lonely'),('Mild'), ('Modest'),
    ('Naive'), ('Naughty'),('Quiet'), ('Quirky'),
    ('Rash'), ('Relaxed'),('Sassy'), ('Serious'),('Timid');

SELECT * FROM natureTable;

------------------------------ Profiles -------------------------------------
CREATE TABLE profileTable (
    profileId INT NOT NULL AUTO_INCREMENT,
    profileName VARCHAR(60) NOT NULL,
    PRIMARY KEY (profileId)
)

INSERT INTO profileTable (profileName) VALUES
    ('Player'),('Admin');

SELECT * FROM profileTable;

------------------------------ Users --------------------------------------
CREATE TABLE userTable (
    userId INT NOT NULL AUTO_INCREMENT,
    profileId INT NOT NULL,
    email VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    username VARCHAR(20) NOT NULL,
    exp BIGINT NOT NULL DEFAULT 0,
    coins BIGINT NOT NULL DEFAULT 0,
    premmium BOOLEAN NOT NULL DEFAULT 0,
    regionPositionId INT NOT NULL DEFAULT 1,
    placeTypePositionId INT NOT NULL DEFAULT 1,
    mapPositionId INT NOT NULL DEFAULT 1,
    xCoordenate INT NOT NULL DEFAULT 0,
    yCoordenate INT NOT NULL DEFAULT 0,
    FOREIGN KEY (profileId) REFERENCES profileTable(profileId),
    PRIMARY KEY (userId)
)

INSERT INTO userTable (email, password, username, profileId) VALUES
    ('teste.player2@gmail.com', 'teste123', 'Player2', 1);

SELECT * FROM userTable;

SELECT username FROM userTable 
WHERE email = 'teste.player1@gmail.com' AND password = 'teste1234';

------------------------------ Pokemon -----------------------------------
CREATE TABLE pokemonTable (
    pokemonId BIGINT NOT NULL AUTO_INCREMENT,
    id INT NOT NULL,
    pokemonCustomName VARCHAR(40),
    exp BIGINT,
    hpIv INT NOT NULL,
    atkIv INT NOT NULL,
    spAtkIv INT NOT NULL,
    defIv INT NOT NULL,
    spDefIv INT NOT NULL,
    speedIv INT NOT NULL,
    shiny BOOLEAN NOT NULL,
    FOREIGN KEY (userId) REFERENCES userTable(userId)
    FOREIGN KEY (natureId) REFERENCES natureTable(natureId)
    PRIMARY KEY (pokemonId)
)

------------------------------ Items Types ------------------------------
CREATE TABLE itemTypeTable (
    itemTypeId BIGINT NOT NULL AUTO_INCREMENT,
    itemTypeName VARCHAR(40) NOT NULL,
    PRIMARY KEY (itemTypeId)
)

INSERT INTO itemTypeTable (itemTypeName) VALUES
    ('Equipment');

SELECT * FROM itemTypeTable;

------------------------------ Items ------------------------------------
CREATE TABLE itemTable (
    itemId VARCHAR(5) NOT NULL,
    itemTypeId BIGINT NOT NULL,
    itemName VARCHAR(40) NOT NULL,
    itemSprite VARCHAR(40) NOT NULL,
    itemDescription VARCHAR(500) NOT NULL,
    itemEffect VARCHAR(60),
    FOREIGN KEY (itemTypeId) REFERENCES itemTypeTable(itemTypeId),
    PRIMARY KEY (itemId)
)

INSERT INTO itemTable (itemId, itemTypeId, itemName, itemSprite, itemDescription) VALUES
    ('b1', 2, 'Pokeball', 'poke-ball', 
    'A device for catching wild Pokémon. It is thrown like a ball at the target. It is designed as a capsule system.');

ALTER TABLE itemTable
ADD COLUMN buyValue BIGINT NOT NULL DEFAULT 1 AFTER itemEffect;

UPDATE itemTable SET itemEffect='10' WHERE itemId='b1';

SELECT * FROM itemTable;

------------------------------ Items | Usuários -----------------------------
CREATE TABLE userItemTable (
    userId INT NOT NULL,
    itemId VARCHAR(5) NOT NULL,
    quantity BIGINT NOT NULL,
    PRIMARY KEY (userId, itemId),
    FOREIGN KEY (userId) REFERENCES userTable(userId),
    FOREIGN KEY (itemId) REFERENCES itemTable(itemId)
)

SELECT * FROM userItemTable;

INSERT INTO userItemTable (userId, itemId, quantity) VALUES
    (1, 'b1', 10);