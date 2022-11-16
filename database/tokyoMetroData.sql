-- Tokyo Rail Database 
-- Group Number 54
-- Tyler Dennis & Lauren Pigue

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- CREATE TABLES

DROP TABLE IF EXISTS `Trains`;
CREATE TABLE `Trains` (
    `train_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `model` varchar(30) NOT NULL,
    `last_service_date` date NOT NULL,
    `line_code` int,
    PRIMARY KEY (`train_ID`)
);

DROP TABLE IF EXISTS `Stations`;
CREATE TABLE `Stations` (
    `station_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `location_name` varchar(30) NOT NULL,
    `line_code` int,
    PRIMARY KEY (`station_ID`)
);

DROP TABLE IF EXISTS `Lines`;
CREATE TABLE `Lines` (
    `line_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `line_name` varchar(30) NOT NULL,
    `start_station` int,
    `end_station` int, 
    PRIMARY KEY (`line_ID`)
);

DROP TABLE IF EXISTS `Schedules`;
CREATE TABLE `Schedules` (
    `schedule_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `arrival_time` time NOT NULL,
    `departure_time` time NOT NULL,
    `station_code` int, 
    `train_code` int,
    PRIMARY KEY (`schedule_ID`)
);

DROP TABLE IF EXISTS `Operators`;
CREATE TABLE `Operators` (
    `operator_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `first_name` varchar(30) NOT NULL,
    `last_name` varchar(30)NOT NULL,
    `phone_number` int(11) NOT NULL, 
    `email` varchar(40) NOT NULL,
    `train_code` int,
    PRIMARY KEY (`operator_ID`)
);


-- UPDATE FOREIGN KEYS

ALTER TABLE `Trains`
ADD FOREIGN KEY (`line_code`) REFERENCES `Lines`(`line_ID`) ON DELETE CASCADE;

ALTER TABLE `Stations`
ADD FOREIGN KEY (`line_code`) REFERENCES `Lines`(`line_ID`) ON DELETE CASCADE;

ALTER TABLE `Lines`
ADD FOREIGN KEY (`start_station`) REFERENCES `Stations`(`station_ID`) ON DELETE CASCADE,
ADD FOREIGN KEY (`end_station`) REFERENCES `Stations`(`station_ID`) ON DELETE CASCADE;

ALTER TABLE `Schedules`
ADD FOREIGN KEY (`station_code`) REFERENCES `Stations`(`station_ID`) ON DELETE CASCADE,
ADD FOREIGN KEY (`train_code`) REFERENCES `Trains`(`train_ID`) ON DELETE CASCADE;

ALTER TABLE `Operators`
ADD FOREIGN KEY (`train_code`) REFERENCES `Trains`(`train_ID`) ON DELETE CASCADE;


-- INSERT INTO TABLES

INSERT INTO `Trains` (`model`, `last_service_date`)
VALUES  ('500 Series', '2021-04-15'),
        ('E2 Series', '2021-09-06'),
        ('E2 Series', '2021-10-21'),
        ('E3 Series', '2021-11-11');

INSERT INTO `Lines` (`line_name`)
VALUES  ('Ginza'),
        ('Marunouchi'),
        ('Hibiya'),
        ('Tōzai'),
        ('Chiyoda'),
        ('Yūrakuchō'),
        ('Hanzõmon'),
        ('Namboku'),
        ('Fukutoshin');

INSERT INTO `Stations` (`location_name`, `station_no`, `line_code`)
VALUES  ('Shibuya', 1, 1),
        ('Omote-sando', 2, 1),
        ('Gaiemmae', 3, 1),
        ('Aoyama-itchome', 4, 1),
        ('Akasaka-mitsuke', 5, 1),
        ('Tameike-sanno', 6, 1),
        ('Toranomon', 7, 1),
        ('Shimbashi', 8, 1),
        ('Ginza', 9, 1),
        ('Kyobashi', 10, 1),
        ('Nihombashi', 11, 1),
        ('Mitsukoshimae', 12, 1),
        ('Kanda', 13, 1),
        ('Suehirocho', 14, 1),
        ('Ueno-hirojoki', 15, 1),
        ('Ueno', 16, 1),
        ('Inaricho', 17, 1),
        ('Tawaramachi', 18, 1),
        ('Asukasa', 19, 1);

INSERT INTO `Schedules` (`arrival_time`, `departure_time`, `station_code`, `train_code`)
VALUES  ('10:55:00', '11:00:00'),
        ('09:25:00', '09:30:00'),
        ('07:55:00', '08:00:00'),
        ('07:25:00', '07:30:00');

INSERT INTO `Operators` (`first_name`, `last_name`, `phone_number`, `email`)
VALUES  ('Haruto', 'Tanaka', 499274029, 'tanakah@metro.tokyo.jp'),
        ('Itsuki', 'Noguchi', 499284706, 'noguchii@metro.tokyo.jp'),
        ('Chiyo', 'Fujita', 499207058, 'fujitac@metro.tokyo.jp'),
        ('Isamu', 'Sano', 499288428, 'noguchii@metro.tokyo.jp');


-- Add mock data into the db
-- For this simple example, no sub-queries were used,
-- but these will be utilized in our final project

-- Update start_station and end_station for all Lines

UPDATE `Lines`
SET  start_station=1, end_station=5
WHERE line_ID=1;

UPDATE `Lines`
SET start_station=2, end_station=6
WHERE line_ID=2;

UPDATE `Lines`
SET start_station=3, end_station=7
WHERE line_ID=3;

UPDATE `Lines`
SET start_station=4, end_station=8
WHERE line_ID=4;

-- Update line_code for all Trains

UPDATE `Trains`
SET line_code=1
WHERE train_ID=1;

UPDATE `Trains`
SET line_code=2
WHERE train_ID=2;

UPDATE `Trains`
SET line_code=3
WHERE train_ID=3;

UPDATE `Trains`
SET line_code=4
WHERE train_ID=4;

-- Update station_code and train_code for all Schedules

UPDATE `Schedules`
SET station_code=1, train_code=1
WHERE schedule_ID=1;

UPDATE `Schedules`
SET station_code=2, train_code=2
WHERE schedule_ID=2;

UPDATE `Schedules`
SET station_code=3, train_code=3
WHERE schedule_ID=3;

UPDATE `Schedules`
SET station_code=4, train_code=4
WHERE schedule_ID=4;


-- Update train_code for all Operators

UPDATE `Operators`
SET train_code=1
WHERE operator_ID=1;

UPDATE `Operators`
SET train_code=2
WHERE operator_ID=2;

UPDATE `Operators`
SET train_code=3
WHERE operator_ID=3;

UPDATE `Operators`
SET train_code=4
WHERE operator_ID=4;

--  RUN SOME SQL TEST COMMANDS

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
