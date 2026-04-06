# {Feature} - NestJS Backend Implementation Plan

**Created**: {date}
**Session**: {session_id}
**Complexity**: Low | Medium | High

**Note**: This is a reference plan for the NestJS backend (separate repo). The frontend consumes the API via React Query hooks.

---

## 1. Database Schema (Prisma)

### Model: `{Entity}`

```prisma
// prisma/schema.prisma
model {Entity} {
  id        String   @id @default(cuid())
  {field}   {Type}   @{constraints}
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([{field}])
}
```

### Relations
- `{Entity}` → `{RelatedEntity}`: {relationship type}

## 2. NestJS Module Structure

```
src/{domain}/
├── {domain}.controller.ts     # HTTP endpoints
├── {domain}.service.ts        # Business logic
├── {domain}.module.ts         # Module definition
├── dto/
│   ├── create-{entity}.dto.ts
│   └── update-{entity}.dto.ts
├── entities/
│   └── {entity}.entity.ts
└── {domain}.repository.ts     # Data access (optional)
```

## 3. API Endpoints

### Controller: `{Entity}Controller`

| Endpoint | Method | Auth | Input | Output |
|----------|--------|------|-------|--------|
| /{domain} | GET | JWT optional | Query filters | [{Entity}] |
| /{domain}/{id} | GET | JWT optional | - | {Entity} |
| /{domain} | POST | JWT required | Create{Entity}Dto | {Entity} |
| /{domain}/{id} | PUT | JWT + owner | Update{Entity}Dto | {Entity} |
| /{domain}/{id} | DELETE | JWT + owner | - | void |

## 4. DTOs (Request/Response Validation)

```typescript
// src/{domain}/dto/create-{entity}.dto.ts
export class Create{Entity}Dto {
  @IsString()
  @MinLength(1)
  name: string;
  // TODO: Add other fields
}

// src/{domain}/dto/update-{entity}.dto.ts
export class Update{Entity}Dto extends PartialType(Create{Entity}Dto) {}
```

## 5. Service Layer

```typescript
// src/{domain}/{domain}.service.ts
export class {Entity}Service {
  async create(userId: string, dto: Create{Entity}Dto): Promise<{Entity}> {
    // Validation happens in controller with DTO class-validator
    return this.prisma.{entity}.create({
      data: { ...dto, userId },
    });
  }

  async findAll(filters?: {Entity}Filters): Promise<{Entity}[]> {
    // Implement filtering logic
  }

  async findOne(id: string): Promise<{Entity}> {
    // Not found handling
  }

  async update(id: string, userId: string, dto: Update{Entity}Dto): Promise<{Entity}> {
    // Ownership check
  }

  async delete(id: string, userId: string): Promise<void> {
    // Ownership check
  }
}
```

## 6. Authentication & Authorization

- **JWT validation**: Guard in controller methods
- **Ownership checks**: Service methods verify userId matches
- **Role-based access**: If different permissions needed

## 7. Error Handling

- 400 Bad Request: Validation errors from DTO
- 401 Unauthorized: Missing/invalid JWT
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Entity doesn't exist
- 500 Internal Server Error: Unexpected errors

## 8. Database Migrations

```bash
# Generate migration after schema changes
npx prisma migrate dev --name add_{entity}

# Apply migrations in production
npx prisma migrate deploy
```

## 9. Files to Create

- `src/{domain}/{domain}.module.ts`
- `src/{domain}/{domain}.controller.ts`
- `src/{domain}/{domain}.service.ts`
- `src/{domain}/dto/create-{entity}.dto.ts`
- `src/{domain}/dto/update-{entity}.dto.ts`
- `src/{domain}/entities/{entity}.entity.ts`
- `prisma/migrations/{timestamp}_add_{entity}/migration.sql`

## 10. Implementation Steps (Backend)

1. Define Prisma model
2. Create DTOs with validation
3. Create service methods
4. Create controller endpoints
5. Add JWT guards
6. Implement error handling
7. Test with API client

## Frontend Integration

Frontend consumes these endpoints via React Query hooks:
- `useList{Entities}()` → GET /{domain}
- `useGet{Entity}(id)` → GET /{domain}/{id}
- `useCreate{Entity}()` → POST /{domain}
- `useUpdate{Entity}()` → PUT /{domain}/{id}
- `useDelete{Entity}()` → DELETE /{domain}/{id}
