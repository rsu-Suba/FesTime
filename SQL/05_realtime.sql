-- Realtime
ALTER TABLE stalls_status REPLICA IDENTITY FULL;
-- @feature: news
ALTER TABLE news REPLICA IDENTITY FULL;
-- @end-feature

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE stalls_status;
-- @feature: news
ALTER PUBLICATION supabase_realtime ADD TABLE news;
-- @end-feature
