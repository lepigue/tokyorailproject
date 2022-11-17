-- Tokyo Rail Database 
-- Group Number 54
-- Tyler Dennis & Lauren Pigue

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- CREATE TABLES

DROP TABLE IF EXISTS `Operators`;
DROP TABLE IF EXISTS `Schedules`;
DROP TABLE IF EXISTS `Trains`;
DROP TABLE IF EXISTS `Lines_has_Stations`;
DROP TABLE IF EXISTS `Stations`;
DROP TABLE IF EXISTS `Lines`;

CREATE TABLE `Trains` (
    `train_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `model` varchar(30) NOT NULL,
    `last_service_date` date NOT NULL,
    `line_code` int,
    PRIMARY KEY (`train_ID`)
);

CREATE TABLE `Stations` (
    `station_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `location_name` varchar(30) NOT NULL,
    `station_num` int,
    `line_code` int,
    PRIMARY KEY (`station_ID`)
);

CREATE TABLE `Lines` (
    `line_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `line_name` varchar(30) NOT NULL,
    PRIMARY KEY (`line_ID`)
);

CREATE TABLE `Schedules` (
    `schedule_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `arrival_time` time NOT NULL,
    `departure_time` time NOT NULL,
    `station_code` int, 
    `train_code` int,
    PRIMARY KEY (`schedule_ID`)
);

CREATE TABLE `Operators` (
    `operator_ID` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `first_name` varchar(30) NOT NULL,
    `last_name` varchar(30)NOT NULL,
    `phone_number` int(11) NOT NULL, 
    `email` varchar(40) NOT NULL,
    `train_code` int,
    PRIMARY KEY (`operator_ID`)
);

CREATE TABLE `Lines_has_Stations` (
    `lines_stations_id` int(8) NOT NULL UNIQUE AUTO_INCREMENT,
    `lines_line_id` int,
    `stations_station_id` int,
    PRIMARY KEY (`lines_stations_id`)
);

-- UPDATE FOREIGN KEYS

ALTER TABLE `Trains`
ADD FOREIGN KEY (`line_code`) REFERENCES `Lines`(`line_ID`) ON DELETE CASCADE;

ALTER TABLE `Stations`
ADD FOREIGN KEY (`line_code`) REFERENCES `Lines`(`line_ID`) ON DELETE CASCADE;

ALTER TABLE `Schedules`
ADD FOREIGN KEY (`station_code`) REFERENCES `Stations`(`station_ID`) ON DELETE CASCADE,
ADD FOREIGN KEY (`train_code`) REFERENCES `Trains`(`train_ID`) ON DELETE CASCADE;

ALTER TABLE `Operators`
ADD FOREIGN KEY (`train_code`) REFERENCES `Trains`(`train_ID`) ON DELETE CASCADE;


-- INSERT INTO TABLES

INSERT INTO `Trains` (`model`, `last_service_date`)
VALUES  ('100 Series', '2021-04-15'),
        ('E1 Series', '2021-09-06'),
        ('E1 Series', '2021-10-21'),
        ('E1 Series', '2021-11-11'),
        ('200 Series', '2021-04-15'),
        ('E2 Series', '2020-09-06'),
        ('E2 Series', '2020-10-21'),
        ('E2 Series', '2020-11-11'),
        ('300 Series', '2020-04-15'),
        ('E3 Series', '2019-09-06'),
        ('E3 Series', '2019-10-21'),
        ('E3 Series', '2019-11-11'),
        ('400 Series', '2019-04-15'),
        ('E4 Series', '2018-09-06'),
        ('E4 Series', '2018-10-21'),
        ('E4 Series', '2018-11-11'),
        ('500 Series', '2018-04-15'),
        ('E5 Series', '2017-09-06'),
        ('E5 Series', '2017-10-21'),
        ('E5 Series', '2017-11-11'),
        ('600 Series', '2017-04-15'),
        ('E6 Series', '2017-09-06'),
        ('E6 Series', '2017-10-21'),
        ('E6 Series', '2017-11-11'),
        ('700 Series', '2016-04-15'),
        ('E7 Series', '2016-09-06'),
        ('E7 Series', '2016-10-21'),
        ('E7 Series', '2016-11-11'),
        ('800 Series', '2015-04-15'),
        ('E8 Series', '2015-09-06'),
        ('E8 Series', '2015-10-21'),
        ('E8 Series', '2015-11-11'),
        ('900 Series', '2014-04-15'),
        ('E9 Series', '2014-09-06'),
        ('E9 Series', '2014-10-21'),
        ('E9 Series', '2014-11-11');

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

INSERT INTO `Stations` (`location_name`)
VALUES  ('Shibuya'),
        ('Omote-sando'),
        ('Gaiemmae'),
        ('Aoyama-itchome'),
        ('Akasaka-mitsuke'),
        ('Tameike-sanno'),
        ('Toranomon'),
        ('Shimbashi'),
        ('Ginza'),
        ('Kyobashi'),
        ('Nihombashi'),
        ('Mitsukoshimae'),
        ('Kanda'),
        ('Suehirocho'),
        ('Ueno-hirojoki'),
        ('Ueno'),
        ('Inaricho'),
        ('Tawaramachi'),
        ('Asukasa');

INSERT INTO `Schedules` (`arrival_time`, `departure_time`)
VALUES  ('10:55:00', '11:00:00'),
        ('09:25:00', '09:30:00'),
        ('07:55:00', '08:00:00'),
        ('07:25:00', '07:30:00');

INSERT INTO `Operators` (`first_name`, `last_name`, `phone_number`, `email`)
VALUES  ('Haruto', 'Tanaka', 499274029, 'tanakah@metro.tokyo.jp'),
        ('Itsuki', 'Noguchi', 499284706, 'noguchii@metro.tokyo.jp'),
        ('Chiyo', 'Fujita', 499207058, 'fujitac@metro.tokyo.jp'),
        ('Isamu', 'Sano', 499288428, 'noguchii@metro.tokyo.jp'),
        ('Aina', 'Arakaki', 499274718, 'arakakia@metro.tokyo.jp'),
        ('Chiere', 'Komeda', 499274718, 'komedac@metro.tokyo.jp'),
        ('Kazumi', 'Hori', 499234523, 'horik@metro.tokyo.jp'),
        ('Naota', 'Ishihara', 499257771, 'ishiharan@metro.tokyo.jp'),
        ('Motsuzuki', 'Tetsuharu', 499123455, 'tetsuharum@metro.tokyo.jp'),
        ('Hayao', 'Hirai', 499993492, '@metro.tokyo.jp'),
        ('Yume', 'Tsukada', 499389564, 'tsukaday@metro.tokyo.jp'),
        ('Yoshiharu', 'Fujisawa', 499098789, 'fujisaway@metro.tokyo.jp'),
        ('Yasuomi', 'Nakai', 499987345, 'nakaiy@metro.tokyo.jp'),
        ('Rikuto', 'Susui', 499099457, 'susuir@metro.tokyo.jp'),
        ('Teruyoshi', 'Tanabe', 499973423, 'tanabet@metro.tokyo.jp'),
        ('Naotatsu', 'Ono', 499211344, 'onon@metro.tokyo.jp'),
        ('Ichiei', 'Hamada', 499234508, 'hamadai@metro.tokyo.jp'),
        ('Hisa', 'Yagawa', 499234598, 'yagawah@metro.tokyo.jp'),
        ('Namito', 'Sanwa', 499987632, 'sanwan@metro.tokyo.jp'),
        ('Jiro', 'Sakakihara', 499098765, 'sakakiharaj@metro.tokyo.jp'),
        ('Norie', 'Motsuzuki', 499247743, 'motsuzukin@metro.tokyo.jp'),
        ('Nakako', 'Senda', 499109883, 'sendan@metro.tokyo.jp'),
        ('Reina', 'Endou', 499087345, 'endour@metro.tokyo.jp'),
        ('Haruna', 'Ohara', 499936746, 'oharah@metro.tokyo.jp'),
        ('Takaho', 'Kichikawa', 499934578, 'kichikawat@metro.tokyo.jp'),
        ('Nozomi', 'Yasuda', 499243258, 'yasudan@metro.tokyo.jp'),
        ('Yuzuko', 'Matsuo', 499234518, 'matsuoy@metro.tokyo.jp'),
        ('Ryuuto', 'Kuhabara', 499223447, 'kuhabarar@metro.tokyo.jp'),
        ('Mikihisa', 'Shimoda', 499797979, 'shimodam@metro.tokyo.jp'),
        ('Hanaka', 'Oomori', 499876345, 'oomorih@metro.tokyo.jp'),
        ('Muneto', 'Nakazawa', 499467872, 'nakazawam@metro.tokyo.jp'),
        ('Masahiro', 'Morimoto', 499973458, 'morimotom@metro.tokyo.jp'),
        ('Mako', 'Shiyouji', 499349848, 'shiyoujim@metro.tokyo.jp'),
        ('Tamaki', 'Sonoda', 499125451, 'sonodat@metro.tokyo.jp'),
        ('Sanami', 'Yamazaki', 499492348, 'yamazakis@metro.tokyo.jp'),
        ('Tamaki', 'Sai', 499387633, 'sait@metro.tokyo.jp'),
        ('Fuuki', 'Iwamoto', 499345876, 'iwamotof@metro.tokyo.jp'),
        ('Taku', 'Matsuo', 499345876, 'matsuot@metro.tokyo.jp'),
        ('Kensaku', 'Matsubara', 499232225, 'matsubarak@metro.tokyo.jp'),
        ('Fukiko', 'Kaai', 499444355, 'kaaif@metro.tokyo.jp'),
        ('Miho', 'Kanno', 495578577, 'kannom@metro.tokyo.jp'),
        ('Taiki', 'Kitajima', 499238741, 'kitajimat@metro.tokyo.jp');

INSERT INTO `Lines_has_Stations` (`stations_station_id`, `lines_line_id`)
VALUES  ('1', '1'),
        ('2', '2'),
        ('3', '3'),
        ('4', '4');

-- Add mock data into the db
-- For this simple example, no sub-queries were used,
-- but these will be utilized in our final project

-- Update line_code for all Trains

UPDATE `Trains`
SET line_code=1
WHERE train_ID=1;

UPDATE `Trains`
SET line_code=1
WHERE train_ID=2;

UPDATE `Trains`
SET line_code=1
WHERE train_ID=3;

UPDATE `Trains`
SET line_code=1
WHERE train_ID=4;

UPDATE `Trains`
SET line_code=2
WHERE train_ID=5;

UPDATE `Trains`
SET line_code=2
WHERE train_ID=6;

UPDATE `Trains`
SET line_code=2
WHERE train_ID=7;

UPDATE `Trains`
SET line_code=2
WHERE train_ID=8;

UPDATE `Trains`
SET line_code=3
WHERE train_ID=9;

UPDATE `Trains`
SET line_code=3
WHERE train_ID=10;

UPDATE `Trains`
SET line_code=3
WHERE train_ID=11;

UPDATE `Trains`
SET line_code=3
WHERE train_ID=12;

UPDATE `Trains`
SET line_code=4
WHERE train_ID=13;

UPDATE `Trains`
SET line_code=4
WHERE train_ID=14;

UPDATE `Trains`
SET line_code=4
WHERE train_ID=15;

UPDATE `Trains`
SET line_code=4
WHERE train_ID=16;

UPDATE `Trains`
SET line_code=5
WHERE train_ID=17;

UPDATE `Trains`
SET line_code=5
WHERE train_ID=18;

UPDATE `Trains`
SET line_code=5
WHERE train_ID=19;

UPDATE `Trains`
SET line_code=5
WHERE train_ID=20;

UPDATE `Trains`
SET line_code=6
WHERE train_ID=21;

UPDATE `Trains`
SET line_code=6
WHERE train_ID=22;

UPDATE `Trains`
SET line_code=6
WHERE train_ID=23;

UPDATE `Trains`
SET line_code=6
WHERE train_ID=24;

UPDATE `Trains`
SET line_code=7
WHERE train_ID=25;

UPDATE `Trains`
SET line_code=7
WHERE train_ID=26;

UPDATE `Trains`
SET line_code=7
WHERE train_ID=27;

UPDATE `Trains`
SET line_code=7
WHERE train_ID=28;

UPDATE `Trains`
SET line_code=8
WHERE train_ID=29;

UPDATE `Trains`
SET line_code=8
WHERE train_ID=30;

UPDATE `Trains`
SET line_code=8
WHERE train_ID=31;

UPDATE `Trains`
SET line_code=8
WHERE train_ID=32;

UPDATE `Trains`
SET line_code=9
WHERE train_ID=33;

UPDATE `Trains`
SET line_code=9
WHERE train_ID=34;

UPDATE `Trains`
SET line_code=9
WHERE train_ID=35;

UPDATE `Trains`
SET line_code=9
WHERE train_ID=36;

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

UPDATE `Operators`
SET train_code=5
WHERE operator_ID=5;

UPDATE `Operators`
SET train_code=6
WHERE operator_ID=6;

UPDATE `Operators`
SET train_code=6
WHERE operator_ID=7;

UPDATE `Operators`
SET train_code=7
WHERE operator_ID=8;

UPDATE `Operators`
SET train_code=8
WHERE operator_ID=9;

UPDATE `Operators`
SET train_code=9
WHERE operator_ID=10;

UPDATE `Operators`
SET train_code=10
WHERE operator_ID=11;

UPDATE `Operators`
SET train_code=10
WHERE operator_ID=12;

UPDATE `Operators`
SET train_code=10
WHERE operator_ID=13;

UPDATE `Operators`
SET train_code=11
WHERE operator_ID=14;

UPDATE `Operators`
SET train_code=12
WHERE operator_ID=15;

UPDATE `Operators`
SET train_code=13
WHERE operator_ID=16;

UPDATE `Operators`
SET train_code=14
WHERE operator_ID=17;

UPDATE `Operators`
SET train_code=15
WHERE operator_ID=18;

UPDATE `Operators`
SET train_code=16
WHERE operator_ID=19;

UPDATE `Operators`
SET train_code=17
WHERE operator_ID=20;

UPDATE `Operators`
SET train_code=18
WHERE operator_ID=21;

UPDATE `Operators`
SET train_code=19
WHERE operator_ID=22;

UPDATE `Operators`
SET train_code=20
WHERE operator_ID=23;

UPDATE `Operators`
SET train_code=20
WHERE operator_ID=24;

UPDATE `Operators`
SET train_code=21
WHERE operator_ID=25;

UPDATE `Operators`
SET train_code=22
WHERE operator_ID=26;

UPDATE `Operators`
SET train_code=23
WHERE operator_ID=27;

UPDATE `Operators`
SET train_code=24
WHERE operator_ID=28;

UPDATE `Operators`
SET train_code=25
WHERE operator_ID=29;

UPDATE `Operators`
SET train_code=25
WHERE operator_ID=30;

UPDATE `Operators`
SET train_code=26
WHERE operator_ID=31;

UPDATE `Operators`
SET train_code=26
WHERE operator_ID=32;

UPDATE `Operators`
SET train_code=27
WHERE operator_ID=33;

UPDATE `Operators`
SET train_code=29
WHERE operator_ID=34;

UPDATE `Operators`
SET train_code=29
WHERE operator_ID=35;

UPDATE `Operators`
SET train_code=30
WHERE operator_ID=36;

UPDATE `Operators`
SET train_code=31
WHERE operator_ID=37;

UPDATE `Operators`
SET train_code=32
WHERE operator_ID=38;

UPDATE `Operators`
SET train_code=33
WHERE operator_ID=39;

UPDATE `Operators`
SET train_code=34
WHERE operator_ID=40;

UPDATE `Operators`
SET train_code=35
WHERE operator_ID=41;

UPDATE `Operators`
SET train_code=36
WHERE operator_ID=42;

SET FOREIGN_KEY_CHECKS=0;
COMMIT;
