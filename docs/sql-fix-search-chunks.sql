CREATE OR REPLACE FUNCTION search_chunks_semantic(
  p_agent_id TEXT,
  query_embedding vector(768),
  match_count INT DEFAULT 8
)
RETURNS TABLE(id TEXT, content TEXT, filename TEXT, similarity FLOAT)
LANGUAGE SQL STABLE
SET search_path = public
AS $$
  SELECT id, content, filename,
         1 - (embedding <=> query_embedding) AS similarity
  FROM "DocumentChunk"
  WHERE "agentId" = p_agent_id
    AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
