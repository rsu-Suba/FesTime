-- Realtime
-- @feature: booth
ALTER TABLE stalls_status REPLICA IDENTITY FULL;
-- @end-feature
-- @feature: news
ALTER TABLE news REPLICA IDENTITY FULL;
-- @end-feature

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

-- @feature: booth
ALTER PUBLICATION supabase_realtime ADD TABLE stalls_status;
-- @end-feature
-- @feature: news
ALTER PUBLICATION supabase_realtime ADD TABLE news;
-- @end-feature
