// Sliding window log Lua script (sorted set of timestamps)
// KEYS[1]: sorted set key  e.g. {user:123}:log
// ARGV[1]: limit, ARGV[2]: now (unix ms), ARGV[3]: windowMs
// ARGV[4]: cutoff (= now - windowMs), ARGV[5]: nonce (prevents ZADD dedup on same-ms requests)
export const SLIDING_WINDOW_LOG = `
local limit = tonumber(ARGV[1])
local now = tonumber(ARGV[2])
local windowMs = tonumber(ARGV[3])
local cutoff = tonumber(ARGV[4])
local nonce = ARGV[5]
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', cutoff)
redis.call('ZADD', KEYS[1], now, now .. ':' .. nonce)
redis.call('PEXPIRE', KEYS[1], windowMs)
local count = tonumber(redis.call('ZCARD', KEYS[1]))
local oldest = redis.call('ZRANGE', KEYS[1], 0, 0, 'WITHSCORES')
local oldestTs = tonumber(oldest[2]) or now
local resetAt = oldestTs + windowMs
if count <= limit then
  return {1, limit - count, resetAt, 0}
end
return {0, 0, resetAt, resetAt - now}
`
