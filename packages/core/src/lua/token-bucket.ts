// Token bucket Lua script
// KEYS[1]: hash key  e.g. {user:123}:tb
// ARGV[1]: limit, ARGV[2]: windowMs, ARGV[3]: now (unix ms)
export const TOKEN_BUCKET = `
local limit = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local fields = redis.call('HMGET', KEYS[1], 'tokens', 'lastRefill')
local tokens = tonumber(fields[1]) or limit
local lastRefill = tonumber(fields[2]) or now
local elapsed = now - lastRefill
local newTokens = math.min(limit, tokens + elapsed * (limit / windowMs))
local msPerToken = windowMs / limit
local allowed, remaining, retryAfter, resetAt
if newTokens >= 1 then
  newTokens = newTokens - 1
  allowed = 1
  remaining = math.floor(newTokens)
  retryAfter = 0
  resetAt = now + msPerToken
else
  allowed = 0
  remaining = 0
  retryAfter = math.ceil((1 - newTokens) * msPerToken)
  resetAt = now + retryAfter
end
redis.call('HSET', KEYS[1], 'tokens', newTokens, 'lastRefill', now)
redis.call('PEXPIRE', KEYS[1], windowMs * 2)
return {allowed, remaining, resetAt, retryAfter}
`
