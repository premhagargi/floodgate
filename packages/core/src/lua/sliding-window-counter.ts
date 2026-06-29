// Sliding window counter Lua script (Cloudflare formula)
// KEYS[1]: current window key  e.g. {user:123}:sw:1700000060000
// KEYS[2]: previous window key e.g. {user:123}:sw:1700000000000
// ARGV[1]: limit, ARGV[2]: windowMs, ARGV[3]: now (unix ms)
// ARGV[4]: windowStart, ARGV[5]: ttlMs (= 2 * windowMs)
export const SLIDING_WINDOW_COUNTER = `
local limit = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local windowStart = tonumber(ARGV[4])
local ttlMs = tonumber(ARGV[5])
local prevCount = tonumber(redis.call('GET', KEYS[2])) or 0
local curCount = tonumber(redis.call('INCR', KEYS[1]))
if curCount == 1 then redis.call('PEXPIRE', KEYS[1], ttlMs) end
local elapsed = now % windowMs
local weight = 1 - elapsed / windowMs
local count = math.floor(prevCount * weight) + curCount
local resetAt = windowStart + windowMs
if count <= limit then
  return {1, limit - count, resetAt, 0}
end
return {0, 0, resetAt, resetAt - now}
`
