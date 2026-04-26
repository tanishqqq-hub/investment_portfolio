-- USE investment_engine;

-- INSERT INTO asset_master VALUES
-- (1,'Equity Mutual Fund','equity'),
-- (2,'Direct Stocks','equity'),
-- (3,'Equity ETF','equity'),
-- (4,'Fixed Deposit','debt'),
-- (5,'Debt Mutual Fund','debt'),
-- (6,'Govt Bonds','debt'),
-- (7,'Post Office Schemes','debt'),
-- (8,'Physical Gold','gold'),
-- (9,'Savings Account','safe'),
-- (10,'Liquid Mutual Fund','safe'),
-- (11,'Cryptocurrency','crypto'),
-- (12,'PPF','long_term'),
-- (13,'NPS','long_term');

-- SELECT * FROM asset_master

-- INSERT INTO risk_base_allocation VALUES
-- ('low',15,50,20,15,0),
-- ('low_medium',30,40,15,15,0),
-- ('medium',50,30,10,10,0),
-- ('medium_high',60,20,10,5,5),
-- ('high',65,15,5,5,10);

-- INSERT INTO duration_allocation_rules VALUES
-- ('<1',-25,25),
-- ('1 -- 3',-15,15),
-- ('3 -- 5',0,0),
-- ('5 -- 8',10,-10),
-- ('>8',15,-15);

-- INSERT INTO investment_type_assest_rules VALUES
-- ('monthly',1,'yes'),
-- ('monthly',2,'conditional'),
-- ('monthly',3,'yes'),
-- ('monthly',11,'conditional'),
-- ('lumpsum',4,'yes'),
-- ('lumpsum',5,'yes'),
-- ('lumpsum',8,'yes'),
-- ('lumpsum',11,'conditional');

-- INSERT INTO risk_asset_constraints VALUES
-- ('low',2,'disallow'),
-- ('low',11,'disallow'),
-- ('medium',11,'disallow'),
-- ('medium_high',11,'max_5'),
-- ('high',11,'max_10');

-- INSERT INTO duration_asset_constraints VALUES
-- ('<1',2,'disallow'),
-- ('<1',1,'limit'),
-- ('1 -- 3',2,'limit'),
-- ('>=5',2,'allow');

-- INSERT INTO liquidity_constraints VALUES
-- ('high',4,'disallow'),
-- ('high',6,'disallow'),
-- ('medium',4,'limit'),
-- ('low',4,'allow');

-- INSERT INTO existing_investment_rules VALUES
-- ('gold',20,'reduce'),
-- ('debt',50,'reduce'),
-- ('equity',70,'reduce'),
-- ('crypto',5,'cap');

-- INSERT INTO amount_threshold_rules VALUES
-- ('monthly',100,'SIP,RD'),
-- ('monthly',1000,'SIP,ETF'),
-- ('monthly',5000,'SIP,ETF,Stocks'),
-- ('lumpsum',5000,'FD,DebtMF'),
-- ('lumpsum',25000,'MF,ETF'),
-- ('lumpsum',100000,'Stocks,Gold');

-- INSERT INTO allocation_caps VALUES
-- ('equity',75),
-- ('crypto',10),
-- ('gold',25);

-- INSERT INTO return_reference VALUES
-- ('equity',8,14),
-- ('debt',4,7),
-- ('gold',5,8),
-- ('safe',2,4),
-- ('crypto',-20,30);



