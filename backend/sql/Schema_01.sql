-- CREATE DATABASE investment_engine;
-- USE investment_engine;

-- CREATE TABLE asset_master(
-- asset_id INT PRIMARY KEY ,
-- asset_name VARCHAR(100),
-- asset_type VARCHAR(100)
-- );

-- CREATE TABLE risk_base_allocation(
-- risk_level VARCHAR(50),
-- equity_pct INT ,
-- dept_pct INT,
-- gold_pct INT,
-- safe_pct INT,
-- crypto_pct INT
-- );

-- CREATE TABLE duration_allocation_rules(
-- duration_bucket VARCHAR(50) PRIMARY KEY,
-- equity_adj INT,
-- dept_adj INT
-- );

-- CREATE TABLE investment_type_assest_rules(
-- investment_type VARCHAR(50) ,
-- asset_id INT ,
-- PRIMARY KEY (investment_type,asset_id),
-- FOREIGN KEY (asset_id) REFERENCES asset_master(asset_id)
-- );

-- CREATE TABLE risk_asset_constraints (
--     risk_level VARCHAR(20),
--     asset_id INT,
--     rule VARCHAR(20),
--     PRIMARY KEY (risk_level, asset_id),
--     FOREIGN KEY (asset_id) REFERENCES asset_master(asset_id)
-- );

-- CREATE TABLE duration_asset_constraints (
--     duration_bucket VARCHAR(20),
--     asset_id INT,
--     rule VARCHAR(20),
--     PRIMARY KEY (duration_bucket, asset_id),
--     FOREIGN KEY (asset_id) REFERENCES asset_master(asset_id)
-- );

-- CREATE TABLE liquidity_constraints (
--     liquidity_need VARCHAR(20),
--     asset_id INT ,
--     rule VARCHAR(20),
--     PRIMARY KEY (liquidity_need, asset_id),
--     FOREIGN KEY (asset_id) REFERENCES asset_master(asset_id)
-- );

-- CREATE TABLE existing_investment_rules (
--     asset_type VARCHAR(50) PRIMARY KEY,
--     threshold_pct INT,
--     action VARCHAR(20)
-- );

-- CREATE TABLE amount_threshold_rules (
--     investment_type VARCHAR(20),
--     min_amount INT,
--     allowed_assets VARCHAR(100),
--     PRIMARY KEY (investment_type, min_amount)
-- );

-- CREATE TABLE allocation_caps (
--     asset_type VARCHAR(50) PRIMARY KEY,
--     max_pct INT
-- );

-- CREATE TABLE return_reference (
--     asset_type VARCHAR(50) PRIMARY KEY,
--     min_return INT,
--     max_return INT
-- );

-- ALTER TABLE risk_base_allocation
-- ADD PRIMARY KEY (risk_level);

-- CREATE TABLE user_profile (
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     risk_level VARCHAR(50),
--     investment_amount INT,
--     investment_type VARCHAR(20),
--     duration_years INT,
--     liquidity_need VARCHAR(20),

--     FOREIGN KEY (risk_level)
--         REFERENCES risk_base_allocation(risk_level),

--     FOREIGN KEY (investment_type)
--         REFERENCES amount_threshold_rules(investment_type)
-- );
SELECT * FROM investment_type_assest_rules;