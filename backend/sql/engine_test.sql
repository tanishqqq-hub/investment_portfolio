-- USE investment_engine;
-- SELECT * FROM user_profile;

-- SELECT 
-- u.user_id,
-- u.risk_level,
-- r.equity_pct,
-- r.dept_pct,
-- r.gold_pct,
-- r.safe_pct,
-- r.crypto_pct
-- FROM user_profile u
-- JOIN risk_base_allocation r
-- ON u.risk_level = r.risk_level
-- WHERE u.user_id = 1;

-- SELECT 
-- user_id,
-- duration_years,
-- CASE
--     WHEN duration_years < 1 THEN '<1'
--     WHEN duration_years BETWEEN 1 AND 3 THEN '1 -- 3'
--     WHEN duration_years BETWEEN 3 AND 5 THEN '3 -- 5'
--     WHEN duration_years BETWEEN 5 AND 8 THEN '5 -- 8'
--     ELSE '>8'
-- END AS duration_bucket
-- FROM user_profile
-- WHERE user_id = 1;

-- SELECT 
-- u.user_id,
-- u.risk_level,
-- d.duration_bucket,

-- (r.equity_pct + d.equity_adj) AS equity_final,
-- (r.dept_pct + d.dept_adj) AS dept_final,
-- r.gold_pct,
-- r.safe_pct,
-- r.crypto_pct

-- FROM user_profile u

-- JOIN risk_base_allocation r
-- ON u.risk_level = r.risk_level

-- JOIN duration_allocation_rules d
-- ON d.duration_bucket =
-- CASE
--     WHEN duration_years < 1 THEN '<1'
--     WHEN duration_years BETWEEN 1 AND 3 THEN '1 -- 3'
--     WHEN duration_years BETWEEN 3 AND 5 THEN '3 -- 5'
--     WHEN duration_years BETWEEN 5 AND 8 THEN '5 -- 8'
--     ELSE '>8'
-- END

-- WHERE u.user_id = 1;

-- SELECT 
-- u.user_id,
-- u.liquidity_need,
-- l.asset_id,
-- l.rule
-- FROM user_profile u
-- LEFT JOIN liquidity_constraints l
-- ON u.liquidity_need = l.liquidity_need
-- WHERE u.user_id = 1;

-- SELECT 
-- u.user_id,

-- (r.equity_pct + d.equity_adj) AS equity_final,

-- CASE 
-- WHEN u.liquidity_need = 'medium'
-- THEN (r.dept_pct + d.dept_adj) - 5
-- ELSE (r.dept_pct + d.dept_adj)
-- END AS dept_final,

-- r.gold_pct,

-- CASE 
-- WHEN u.liquidity_need = 'medium'
-- THEN r.safe_pct + 5
-- ELSE r.safe_pct
-- END AS safe_final,

-- r.crypto_pct

-- FROM user_profile u

-- JOIN risk_base_allocation r
-- ON u.risk_level = r.risk_level

-- JOIN duration_allocation_rules d
-- ON d.duration_bucket =
-- CASE
--     WHEN duration_years < 1 THEN '<1'
--     WHEN duration_years BETWEEN 1 AND 3 THEN '1 -- 3'
--     WHEN duration_years BETWEEN 3 AND 5 THEN '3 -- 5'
--     WHEN duration_years BETWEEN 5 AND 8 THEN '5 -- 8'
--     ELSE '>8'
-- END

-- WHERE u.user_id = 1;

-- SELECT 
-- u.user_id,
-- u.investment_type,
-- a.asset_name,
-- r.allowed
-- FROM user_profile u
-- JOIN investment_type_assest_rules r
-- ON u.investment_type = r.investment_type
-- JOIN asset_master a
-- ON r.asset_id = a.asset_id
-- WHERE u.user_id = 1;

-- SELECT 
-- u.user_id,
-- a.asset_name,
-- a.asset_type
-- FROM user_profile u
-- JOIN investment_type_assest_rules r
-- ON u.investment_type = r.investment_type
-- JOIN asset_master a
-- ON r.asset_id = a.asset_id
-- WHERE u.user_id = 1
-- AND r.allowed = 'yes';

-- WITH final_allocation AS (
-- SELECT 
-- u.user_id,

-- (r.equity_pct + d.equity_adj) AS equity,
-- (r.dept_pct + d.dept_adj) AS dept,
-- r.gold_pct,
-- r.safe_pct,
-- r.crypto_pct

-- FROM user_profile u

-- JOIN risk_base_allocation r
-- ON u.risk_level = r.risk_level

-- JOIN duration_allocation_rules d
-- ON d.duration_bucket =
-- CASE
--     WHEN duration_years < 1 THEN '<1'
--     WHEN duration_years BETWEEN 1 AND 3 THEN '1 -- 3'
--     WHEN duration_years BETWEEN 3 AND 5 THEN '3 -- 5'
--     WHEN duration_years BETWEEN 5 AND 8 THEN '5 -- 8'
--     ELSE '>8'
-- END

-- WHERE u.user_id = 1
-- )
-- SELECT * FROM final_allocation;

-- SELECT 
-- a.asset_type,
-- COUNT(*) AS total_assets
-- FROM user_profile u
-- JOIN investment_type_assest_rules r
-- ON u.investment_type = r.investment_type
-- JOIN asset_master a
-- ON r.asset_id = a.asset_id
-- WHERE u.user_id = 1
-- AND r.allowed = 'yes'
-- GROUP BY a.asset_type;

-- WITH final_allocation AS (
-- SELECT 
-- u.user_id,
-- (r.equity_pct + d.equity_adj) AS equity,
-- (r.dept_pct + d.dept_adj) AS dept,
-- r.gold_pct,
-- r.safe_pct,
-- r.crypto_pct
-- FROM user_profile u
-- JOIN risk_base_allocation r ON u.risk_level=r.risk_level
-- JOIN duration_allocation_rules d
-- ON d.duration_bucket =
-- CASE
--     WHEN duration_years < 1 THEN '<1'
--     WHEN duration_years BETWEEN 1 AND 3 THEN '1 -- 3'
--     WHEN duration_years BETWEEN 3 AND 5 THEN '3 -- 5'
--     WHEN duration_years BETWEEN 5 AND 8 THEN '5 -- 8'
--     ELSE '>8'
-- END
-- WHERE u.user_id=1
-- )

-- SELECT
-- a.asset_name,
-- a.asset_type,

-- CASE a.asset_type
-- WHEN 'equity' THEN f.equity / t.total_assets
-- WHEN 'debt' THEN f.dept / t.total_assets
-- WHEN 'gold' THEN f.gold_pct / t.total_assets
-- WHEN 'safe' THEN f.safe_pct / t.total_assets
-- WHEN 'crypto' THEN f.crypto_pct / t.total_assets
-- END AS allocation_pct

-- FROM final_allocation f

-- JOIN user_profile u ON u.user_id=f.user_id

-- JOIN investment_type_assest_rules r
-- ON u.investment_type=r.investment_type

-- JOIN asset_master a
-- ON r.asset_id=a.asset_id

-- JOIN (
--     SELECT a.asset_type, COUNT(*) total_assets
--     FROM user_profile u
--     JOIN investment_type_assest_rules r
--     ON u.investment_type=r.investment_type
--     JOIN asset_master a
--     ON r.asset_id=a.asset_id
--     WHERE u.user_id=1 AND r.allowed='yes'
--     GROUP BY a.asset_type
-- ) t
-- ON a.asset_type=t.asset_type

-- WHERE u.user_id=1
-- AND r.allowed='yes';

-- SELECT 
-- (r.equity_pct + d.equity_adj) AS equity,
-- (r.dept_pct + d.dept_adj) AS debt,
-- r.safe_pct
-- FROM user_profile u
-- JOIN risk_base_allocation r ON u.risk_level=r.risk_level
-- JOIN duration_allocation_rules d
-- ON d.duration_bucket='3 -- 5'
-- WHERE u.user_id=1;

-- CREATE VIEW final_portfolio AS

-- WITH final_allocation AS (
-- SELECT 
-- u.user_id,
-- (r.equity_pct + d.equity_adj) AS equity,
-- (r.dept_pct + d.dept_adj) AS dept,
-- r.gold_pct,
-- r.safe_pct,
-- r.crypto_pct
-- FROM user_profile u
-- JOIN risk_base_allocation r ON u.risk_level=r.risk_level
-- JOIN duration_allocation_rules d
-- ON d.duration_bucket =
-- CASE
--     WHEN duration_years < 1 THEN '<1'
--     WHEN duration_years BETWEEN 1 AND 3 THEN '1 -- 3'
--     WHEN duration_years BETWEEN 3 AND 5 THEN '3 -- 5'
--     WHEN duration_years BETWEEN 5 AND 8 THEN '5 -- 8'
--     ELSE '>8'
-- END
-- )

-- SELECT
-- f.user_id,
-- a.asset_name,
-- a.asset_type,

-- CASE a.asset_type
-- WHEN 'equity' THEN f.equity / t.total_assets
-- WHEN 'debt' THEN f.dept / t.total_assets
-- WHEN 'gold' THEN f.gold_pct / t.total_assets
-- WHEN 'safe' THEN f.safe_pct / t.total_assets
-- WHEN 'crypto' THEN f.crypto_pct / t.total_assets
-- END AS allocation_pct

-- FROM final_allocation f

-- JOIN user_profile u ON u.user_id=f.user_id

-- JOIN investment_type_assest_rules r
-- ON u.investment_type=r.investment_type

-- JOIN asset_master a
-- ON r.asset_id=a.asset_id

-- JOIN (
--     SELECT u.user_id, a.asset_type, COUNT(*) total_assets
--     FROM user_profile u
--     JOIN investment_type_assest_rules r
--     ON u.investment_type=r.investment_type
--     JOIN asset_master a
--     ON r.asset_id=a.asset_id
--     WHERE r.allowed='yes'
--     GROUP BY u.user_id, a.asset_type
-- ) t
-- ON a.asset_type=t.asset_type AND t.user_id=f.user_id

-- WHERE r.allowed='yes';

-- SELECT * FROM final_portfolio WHERE user_id = 1;
SELECT investment_type, asset_id, allowed
FROM investment_type_assest_rules;