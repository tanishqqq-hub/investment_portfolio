USE investment_engine;
INSERT INTO user_profile
(risk_level, investment_amount, investment_type, duration_years, liquidity_need)
VALUES
('medium',100000,'monthly',5,'low');
SELECT * FROM user_profile