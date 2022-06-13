/**
 * No se me occurio como obtener todos los chats sin tener
 * que preocuparme de todas las relaciones que podrían haber,
 * así que está consulta fuera del ORM se encarga de eso.
 */
-- Messages sended from user
WITH "from_user" AS (
  SELECT
    from_user_id AS self_id,
    to_user_id AS other_user_id,
    COUNT(*) AS count,
    MAX(created_at) AS last_at
  FROM
    "private_messages"
  WHERE
    from_user_id = :user_id
  GROUP BY
    from_user_id,
    to_user_id
),
-- Messages received from user
"to_user" AS (
  SELECT
    to_user_id AS self_id,
    from_user_id AS other_user_id,
    COUNT(*) AS count,
    MAX(created_at) AS last_at
  FROM
    "private_messages"
  WHERE
    to_user_id = :user_id
  GROUP BY
    from_user_id,
    to_user_id
)
SELECT
  to_user.self_id as self_id,
  to_user.other_user_id AS other_user_id,
  to_user.count + from_user.count AS count,
  GREATEST(to_user.last_at, from_user.last_at) AS last_at
FROM
  from_user
  JOIN to_user ON from_user.self_id = to_user.self_id
