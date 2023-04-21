# Server

## Table of Contents
- [Data Models](#data-models)
- [Route Data](#route-data)
- [API Documentation](#api-documentation)
  - [Content](#content)
  - [Tags](#tags)
  - [Devblog](#devblog)

## Data Models
Content is a parent table with a blog and project child table. The blog and project table have a one to one relationship with the content table (via id and content_type). Only one of a blog or project can be related to a peice of content and this is enforced by the database. The tags table has a many to one relationship with the blog table. And the devblog has a one to many relationship with the blog table.

### Content Type Enum
The `ContentType` enum represents the type of content stored in the database.

| Enum Name | Description |
| --- | --- |
| `blog` | Represents a blog content type. |
| `project` | Represents a project content type. |

### NewContent Struct
The `NewContent` struct represents a new content record that can be inserted into the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `slug` | `String` | Minimum length of 1 | The unique slug for the content. |
| `title` | `String` | Minimum length of 1 | The title of the content. |
| `content_desc` | `Option<String>` | N/A | An optional description of the content. |
| `body` | `String` | Minimum length of 1 | The body content of the content. |

### Content Struct
The `Content` struct represents a content record in the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `id` | `i32` | N/A | The unique identifier of the content. |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `slug` | `String` | Minimum length of 1 | The unique slug for the content. |
| `title` | `String` | Minimum length of 1 | The title of the content. |
| `content_desc` | `Option<String>` | N/A | An optional description of the content. |
| `body` | `String` | Minimum length of 1 | The body content of the content. |
| `created_at` | `DateTime<Utc>` | N/A | The date and time the content was created. |
| `updated_at` | `DateTime<Utc>` | N/A | The date and time the content was last updated. |

### NewBlog Struct
The `NewBlog` struct represents a new blog record that can be inserted into the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `related_project_id` | `Option<i32>` | N/A | The optional foreign key to the related project. |
| `devblog_id` | `Option<i32>` | N/A | The optional foreign key to the related devblog. |

### Blog Struct
The `Blog` struct represents a blog record in the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `id` | `i32` | N/A | The unique identifier of the blog. |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `related_project_id` | `Option<i32>` | N/A | The optional foreign key to the related project. |
| `devblog_id` | `Option<i32>` | N/A | The optional foreign key to the related devblog. |

### Tag Struct
The `Tag` struct represents a tag record in the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `id` | `i32` | N/A | The unique identifier of the tag. |
| `blog_id` | `i32` | N/A | The foreign key to the related blog. |
| `title` | `String` | N/A | The title of the tag. |

### NewDevblog Struct
The `NewDevblog` struct represents a new devblog record that can be inserted into the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `title` | `String` | Minimum length of 1 | The title of the devblog. |

### Devblog Struct
The `Devblog` struct represents a devblog record in the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `id` | `i32` | N/A | The unique identifier of the devblog. |
| `title` | `String` | Minimum length of 1 | The title of the devblog. |

### CurrentStatus Enum
The `CurrentStatus` enum represents the current status of a project.

| Enum Variant | Description |
| --- | --- |
| `under_development` | The project is currently under development. |
| `finished` | The project is finished. |

### NewProject Struct
The `NewProject` struct represents a new project record that can be inserted into the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `current_status` | [CurrentStatus](#currentstatus-enum) | N/A | The current status of the project. |
| `github_link` | `Option<String>` | Deserialize with `empty_string_as_none` | The optional GitHub link of the project. |
| `url` | `Option<String>` | Deserialize with `empty_string_as_none` | The optional URL of the project. |
| `start_date` | `Option<DateTime<Utc>>` | N/A | The optional start date of the project. |

### Project Struct
The `Project` struct represents a project record in the database.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `id` | `i32` | N/A | The unique identifier of the project. |
| `current_status` | [CurrentStatus](#currentstatus-enum) | N/A | The current status of the project. |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `github_link` | `Option<String>` | Deserialize with `empty_string_as_none` | The optional GitHub link of the project. |
| `url` | `Option<String>` | Deserialize with `empty_string_as_none` | The optional URL of the project. |
| `start_date` | `Option<DateTime<Utc>>` | N/A | The optional start date of the project. |

### ExtraContent Enum
The `ExtraContent` enum represents extra content associated with a base content.

| Enum Variant | Description |
| --- | --- |
| blog([Blog](#blog-struct)) | Represents a blog content associated with a base content. |
| project([Project](#project-struct)) | Represents a project content associated with a base content. |

### NewExtraContent Enum
The `NewExtraContent` enum represents new extra content that can be associated with a new base content.

| Enum Variant | Description |
| --- | --- |
| blog([NewBlog](#newblog-struct)) | Represents a new blog content associated with a base content. |
| project([NewProject](#newblog-struct)) | Represents a new project content associated with a base content. |

### FullContent Struct
The `FullContent` struct represents a full content object that includes a base content and extra content.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `base_content` | [Content](#content) | Must be valid according to [Content](#content) validation rules | The base content associated with the full content. |
| `extra_content` | [ExtraContent](#extracontent-enum) | Must be valid according to [ExtraContent](#extracontent-enum) validation rules | The extra content associated with the full content. |

### NewFullContent Struct
The `NewFullContent` struct represents a new full content object that includes a new base content and new extra content.

| Field Name | Type | Validation Rules | Description |
| --- | --- | --- | --- |
| `new_base_content` | [NewContent](#newcontent-struct) | Must be valid according to [NewContent](#newcontent-struct) validation rules | The new base content associated with the new full content. |
| `new_extra_content` | [NewExtraContent](#newextracontent-enum) | Must be valid according to [NewExtraContent](#newextracontent-enum) validation rules | The new extra content associated with the new full content. |

### FullContentList Struct
The `FullContentList` struct represents a list of full content objects along with the count of total content items without pagination.

| Field Name | Type | Description |
| --- | --- | --- |
| `full_content_list` | Vec<[FullContent](#fullcontent-struct)> | The list of full content objects. |
| `content_count` | `i64` | The total count of content items without pagination. |

## Route Data

### DbRows Struct
The `DbRows` struct represents a result of a database operation that indicates the number of rows affected.

| Field Name | Type | Description |
| --- | --- | --- |
| `rows_effected` | `i32` | The number of rows affected by the database operation. |

### ShowOrder Enum
The `ShowOrder` enum represents different ways to order content for display.

| Enum Variant | Description |
| --- | --- |
| `Newest` | Represents displaying content in the newest order. |
| `Oldest` | Represents displaying content in the oldest order. |
| `ProjectStartNewest` | Represents displaying content in the newest order based on project start. |
| `ProjectStartOldest` | Represents displaying content in the oldest order based on project start. |

### PageInfo Struct
The `PageInfo` struct represents information about pagination and content display order.

| Field Name | Type | Description |
| --- | --- | --- |
| `content_per_page` | `i64` | The number of content items to display per page. |
| `page` | `i64` | The current page number. |
| `show_order` | [ShowOrder](#showorder-enum) | The order in which to display content. |

### ContentSlug Struct
The `ContentSlug` struct represents a content slug, which is a string identifier for a specific content item.

| Field Name | Type | Description |
| --- | --- | --- |
| `slug` | `String` | The string representation of the content slug. |

### CountReturn Struct
The `CountReturn` struct represents a count value returned from a operation.

| Field Name | Type | Description |
| --- | --- | --- |
| `count` | `i64` | The count value returned from the operation. |

### Id Struct
The `IdStruct` struct represents an identifier for a specific entity.

| Field Name | Type | Description |
| --- | --- | --- |
| `id` | `i32` | The identifier value for the entity. |

### TagsToAdd Struct
The `TagsToAdd` struct represents a list of tags to be added to a bloblog item.

| Field Name | Type | Description |
| --- | --- | --- |
| `tags` | `Vec<String>` | The list of tags to be added to the content item. |

### DevblogTitle Struct
The `DevblogTitle` struct represents the title of a development blog.

| Field Name | Type | Description |
| --- | --- | --- |
| `title` | `String` | The title of the development blog. |

### GetSurroundingData Struct
The `GetSurroundingData` struct represents data used to retrieve surrounding blog items for a specific blog item.

| Field Name | Type | Description |
| --- | --- | --- |
| `devblog_id` | `i32` | The identifier of the development blog. |
| `blog_slug` | `String` | The slug of the content item. |
| `direction_count` | `i64` | The count of surrounding content items to retrieve. |

### SurroundingBlogs Struct
The `SurroundingBlogs` struct represents the surrounding blogs for a specific blog item.

| Field Name | Type | Description |
| --- | --- | --- |
| `before_blogs` | Vec<[FullContent](#fullcontent-struct)> | The list of content items that come before the specific content item. |
| `after_blogs` | Vec<[FullContent](#fullcontent-struct)> | The list of content items that come after the specific content item. |

### ContentFilter Struct
The `ContentFilter` struct represents filters to be applied when retrieving a list of content.

| Field Name | Type | Description |
| --- | --- | --- |
| `content_type` | `ContentType` | The type of content items to retrieve. |
| `project_status` | Option<[CurrentStatus](#currentstatus-enum)> | The current status of the project to filter content items by. |
| `project_blogs` | `Option<i32>` | The identifier of the project to filter content items by. |
| `blog_tag` | `Option<String>` | The tag of the blog to filter content items by. |
| `devblog_id` | `Option<i32>` | The identifier of the development blog to filter content items by. |
| `search` | `Option<String>` | The search query to filter content items by. |

## API Documentation

## Content

### Get content
```http
  GET /content/${slug}
```

Path Parameters:
- [Content Slug](#ContentSlug-Struct)

Response:
- [Full Content](#FullContent-Struct)

### Get content by id
```http
  GET /content/view-from-id/${id}
```

Path Parameters:
- [Id](#Id-Struct)

Response:
- [Full Content](#FullContent-Struct)

### Get list of content
```http
  GET /content/list
```

Query Parameters:
- [Page Info](#PageInfo-Struct)
- [Content Filter](#ContentFilter-Struct)

Response:
- [Full Content List](#FullContentList-Struct)

### Create content
```http
  POST /content/add
```

Headers:
- Authorization: Admin Password

Json Body:
- [New Full Content](#NewFullContent-Struct)

### Update content
```http
  PUT /content/${slug}
```

Headers:
- Authorization: Admin Password

Path Parameters:
- Old [Content Slug](#ContentSlug-Struct)

Json Body:
- [Full Content](#FullContent-Struct)

### Delete content
```http
  DELETE /content/${slug}
```

Headers:
- Authorization: Admin Password

Path Parameters:
- [Content Slug](#ContentSlug-Struct)

Response:
- [Db Rows](#DbRows-Struct)

## Tags
### Get list of tags for blog
```http
  GET /tag/${slug}
```

Path Parameters:
- [Content Slug](#ContentSlug-Struct)

Response:
- Array of [tags](#Tag-Struct)

## Tags
### Add tags to blog
```http
  POST /tag/${slug}
```

Headers:
- Authorization: Admin Password

Path Parameters:
- [Content Slug](#ContentSlug-Struct)

Json Body:
- [Tags To Add](#TagsToAdd-Struct)

### Delete tags from blog
```http
  DELETE /tag/${slug}
```

Headers:
- Authorization: Admin Password

Path Parameters:
- [Content Slug](#ContentSlug-Struct)

## Devblog
### Get devblog
```http
  GET /devblog/${title}
```

Path Parameters:
- [Devblog Title](#DevblogTitle-Struct)

Response:
- [Devblog](#Devblog-Struct)

### Get devblog from id
```http
  GET /devblog/view-from-id/${id}
```

Path Parameters:
- [Id](#Id-Struct)

Response:
- [Devblog](#Devblog-Struct)

### Get next and previous blogs in devblog
```http
  GET /devblog/get-next-prev-blog
```

Query Parameters:
- [Get Surrounding Data](#GetSurroundingData-Struct)

Response:
- [Surrounding Blogs](#SurroundingBlogs-Struct)

### Create devblog
```http
  POST /devblog/add
```

Headers:
- Authorization: Admin Password

Json Body:
- [New Devblog](#NewDevblog-Struct)

### Update devblog
```http
  PUT /devblog/${title}
```

Headers:
- Authorization: Admin Password

Path Parameters:
- Old [title](#DevblogTitle-Struct)

Json Body:
- [Devblog](#Devblog-Struct)

### Delete devblog
```http
  DELETE /devblog/${title}
```

Headers:
- Authorization: Admin Password

Path Parameters:
- [Devblog Title](#DevblogTitle-Struct)