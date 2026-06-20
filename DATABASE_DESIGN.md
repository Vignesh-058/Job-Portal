# Database Design & Optimization

## Collections & Indexes

### 1. Users Collection
- **Compound Index**: `{ email: 1 }` (Unique)
- **Use Case**: Fast authentication lookups.

### 2. Jobs Collection
- **Text Index**: `{ title: 'text', skills: 'text', company: 'text', location: 'text' }`
- **Use Case**: Advanced Search Engine for job seekers supporting relevance ranking and keyword matching.
- **Compound Index**: `{ status: 1, isDeleted: 1, createdAt: -1 }`
- **Use Case**: Optimized sorting and filtering for the job feed.

### 3. Applications Collection
- **Compound Index**: `{ jobId: 1, userId: 1 }` (Unique)
- **Use Case**: Prevent duplicate applications to the same job.
- **Compound Index**: `{ recruiterId: 1, status: 1 }`
- **Use Case**: Fast analytics calculations for hiring rate metrics.

### 4. Companies Collection
- **Compound Index**: `{ name: 1 }`
- **Use Case**: Optimized company searches during job filtering.

## Query Optimization Strategies
- **Caching**: The `JobService` uses Redis to cache complex text-search query results for up to 5 minutes, significantly reducing MongoDB CPU utilization during high-traffic periods.
- **Soft Deletes**: Rather than deleting documents physically, an `isDeleted: true` flag is utilized. To optimize find queries, compound indexes always include `isDeleted: 1`.
