import { pool } from '@/lib/db';
import { error } from '@/lib/api';

export const dynamic = 'force-dynamic';

// Aggregate-only research indicators. These describe the contents of this
// database, not the availability or quality of outdoor recreation in WA.
export async function GET() {
  try {
    const [counts, environments, regions, roles, relationships, quality, owaRelationships, sectors, activityConnections] = await Promise.all([
      pool.query(`SELECT
        (SELECT count(*)::int FROM activities) activities,
        (SELECT count(*)::int FROM organisations) organisations,
        (SELECT count(*)::int FROM locations) locations,
        (SELECT count(*)::int FROM relationships) relationships`),
      pool.query(`SELECT a.environment,
        count(*)::int AS activities,
        count(*) FILTER (WHERE EXISTS (SELECT 1 FROM relationships r WHERE r.activity_id = a.id))::int AS linked_activities,
        count(*) FILTER (WHERE EXISTS (SELECT 1 FROM relationships r WHERE r.activity_id = a.id AND r.organisation_id IS NOT NULL))::int AS with_organisation,
        count(*) FILTER (WHERE EXISTS (SELECT 1 FROM relationships r WHERE r.activity_id = a.id AND r.location_id IS NOT NULL))::int AS with_location
        FROM activities a GROUP BY a.environment ORDER BY a.environment`),
      pool.query(`SELECT region, count(*) FILTER(WHERE kind='organisation')::int organisations,
        count(*) FILTER(WHERE kind='location')::int locations
        FROM (SELECT NULLIF(trim(region),'') region,'organisation' kind FROM organisations
             UNION ALL SELECT NULLIF(trim(region),'') region,'location' kind FROM locations) x
        WHERE region IS NOT NULL GROUP BY region ORDER BY region`),
      pool.query(`SELECT COALESCE(NULLIF(trim(participation_role),''),'Not assessed') label, count(*)::int count
        FROM organisations GROUP BY 1 ORDER BY count DESC`),
      pool.query(`SELECT CASE WHEN organisation_id IS NOT NULL THEN 'Organisation' ELSE 'Location' END label,
        count(*)::int count FROM relationships GROUP BY 1 ORDER BY 1`),
      pool.query(`SELECT
        count(*)::int total,
        count(*) FILTER (WHERE status='Verified')::int verified,
        count(*) FILTER (WHERE NULLIF(trim(source_url),'') IS NULL)::int missing_source,
        count(*) FILTER (WHERE NULLIF(trim(audience),'') IS NULL)::int missing_audience,
        count(*) FILTER (WHERE NULLIF(trim(participation_role),'') IS NULL)::int missing_role,
        count(*) FILTER (WHERE NULLIF(trim(strategic_relevance),'') IS NULL)::int missing_relevance,
        count(*) FILTER (WHERE NULLIF(trim(region),'') IS NULL)::int missing_region,
        count(*) FILTER (WHERE NULLIF(trim(website),'') IS NULL)::int missing_website
        FROM organisations`),
      pool.query(`SELECT COALESCE(NULLIF(trim(existing_owa_relationship),''),'Unknown') label,
        count(*)::int count FROM organisations GROUP BY 1 ORDER BY count DESC`),
      pool.query(`SELECT category label,count(*)::int count FROM activities GROUP BY category ORDER BY count DESC`),
      pool.query(`SELECT a.name label, count(DISTINCT r.organisation_id)::int AS count
        FROM activities a JOIN relationships r ON r.activity_id=a.id AND r.organisation_id IS NOT NULL
        GROUP BY a.id,a.name ORDER BY count DESC,a.name LIMIT 10`)
    ]);
    return Response.json({
      counts: counts.rows[0],
      environments: environments.rows,
      regions: regions.rows,
      participationRoles: roles.rows,
      relationshipTargets: relationships.rows,
      organisationQuality: quality.rows[0],
      owaRelationships: owaRelationships.rows,
      sectors: sectors.rows,
      activityConnections: activityConnections.rows,
      caveat: 'All indicators describe records currently entered into this database. They are not validated measures of sector coverage, demand, performance, equity or service availability.',
      generatedAt: new Date().toISOString()
    });
  } catch (e) { return error(e); }
}
