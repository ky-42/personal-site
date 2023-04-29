# Server

## Table of Contents

- [Tests](#tests)
- [Data Models](#data-models)
- [Route Data](#route-data)
- [API Documentation](#api-documentation)
  - [Content](#content)
  - [Tags](#tags)
  - [Devblog](#devblog)

## Tests

There are four tests that can be run with `cargo test`:

- `single_content` - Tests all CRUD functionality for a single peice of content
- `list_test` - Tests adding multiple peice of content and using the list route
- Ignored: `add_test_content` Adds 16 peices of generated content to the database for testing purposes
- Ignored: `print_json_content` Prints a peice of generated content to the console

## Data Models

Content is a parent table with a blog and project child table. The blog and project table have a one to one relationship with the content table (via id and content_type). Only one of a blog or project can be related to a peice of content and this is enforced by the database. The tags table has a many to one relationship with the blog table. And the devblog has a one to many relationship with the blog table.

## Data Models

The `ContentType` enum represents the type of content stored in the database.

| Enum Name | Description                     |
| --------- | ------------------------------- |
| `blog`    | Represents a blog content type. |

| Enum Name | Description |
| --------- | ----------- |

The `NewContent` struct represents a new content record that can be inserted into the database.
| `project` | Represents a project content type. |
| Field Name | Type | Validation Rules | Description |
| -------------- | --------------------------------- | ------------------- | --------------------------------------- |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `slug` | `String` | Minimum length of 1 | The unique slug for the content. |
| `title` | `String` | Minimum length of 1 | The title of the content. |
| `content_desc` | `Option<String>` | N/A | An optional description of the content. |
| `body` | `String` | Minimum length of 1 | The body content of the content. |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `slug` | `String` | Minimum length of 1 | The unique slug for the content. |

The `Content` struct represents a content record in the database.
| `content_desc` | `Option<String>` | N/A | An optional description of the content. |
| Field Name | Type | Validation Rules | Description |
| -------------- | --------------------------------- | ------------------- | ----------------------------------------------- |
| `id` | `i32` | N/A | The unique identifier of the content. |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `slug` | `String` | Minimum length of 1 | The unique slug for the content. |
| `title` | `String` | Minimum length of 1 | The title of the content. |
| `content_desc` | `Option<String>` | N/A | An optional description of the content. |
| `body` | `String` | Minimum length of 1 | The body content of the content. |
| `created_at` | `DateTime<Utc>` | N/A | The date and time the content was created. |
| `updated_at` | `DateTime<Utc>` | N/A | The date and time the content was last updated. |
| `slug` | `String` | Minimum length of 1 | The unique slug for the content. |

### NewBlog Struct

| `content_desc` | `Option<String>` | N/A | An optional description of the content. |
| `body` | `String` | Minimum length of 1 | The body content of the content. |
| Field Name | Type | Validation Rules | Description |
| -------------------- | ------------- | ---------------- | ------------------------------------------------ |
| `related_project_id` | `Option<i32>` | N/A | The optional foreign key to the related project. |
| `devblog_id` | `Option<i32>` | N/A | The optional foreign key to the related devblog. |

### Blog Struct

The`New`s represents a new blog record that can be inserted into the database.
The `Blog` struct represents a blog record in the database.
| Field Name | Type | Validation Rules | Description |
| Field Name | Type | Validation Rules | Description |
| -------------------- | --------------------------------- | ---------------- | ------------------------------------------------ |
| `id` | `i32` | N/A | The unique identifier of the blog. |
| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `related_project_id` | `Option<i32>` | N/A | The optional foreign key to the related project. |
| `devblog_id` | `Option<i32>` | N/A | The optional foreign key to the related devblog. |
The `Blog` struct represents a blog record in the database.

The `Tag` struct represents a tag record in the database.
| -------------------- | --------------------------------- | ---------------- | ------------------------------------------------ |
| Field Name | Type | Validation Rules | Description |
| ---------- | -------- | ---------------- | ------------------------------------ |
| `id` | `i32` | N/A | The unique identifier of the tag. |
| `blog_id` | `i32` | N/A | The foreign key to the related blog. |
| `title` | `String` | N/A | The title of the tag. |

### Tag Struct

### NewDevblog Struct

The `NewDevblog` struct represents a new devblog record that can be inserted into the database.
Tata
| Field Name | Type | Validation Rules | Description |
| ---------- | -------- | ------------------- | ------------------------- |
| `title` | `String` | Minimum length of 1 | The title of the devblog. |
| `blog_id` | `i32` | N/A | The foreign key to the related blog. |
| `title` | `String` | N/A | The title of the tag. |

The `Devblog` struct represents a devblog record in the database.

### NewDevblog Struct

| Field Name | Type     | Validation Rules    | Description                           |
| ---------- | -------- | ------------------- | ------------------------------------- |
| `id`       | `i32`    | N/A                 | The unique identifier of the devblog. |
| `title`    | `String` | Minimum length of 1 | The title of the devblog.             |
| ---------- | -------- | ------------------- | -------------------------             |
| `title`    | `String` | Minimum length of 1 | The title of the devblog.             |

The `CurrentStatus` enum represents the current status of a project.

### Devblog Struct

| Enum Variant        | Description                                 |
| ------------------- | ------------------------------------------- |
| `under_development` | The project is currently under development. |

| ---------- | -------- | ------------------- | ------------------------------------- |

### NewProject Struct

The `NewProject` struct represents a new project record that can be inserted into the database.
|titl | `Sig`|Miimumlnghf1|Thtlfvblog |
| Field Name | Type | Validation Rules | Description |
| ---------------- | ------------------------------------ | --------------------------------------- | ---------------------------------------- |
| `current_status` | [CurrentStatus](#currentstatus-enum) | N/A | The current status of the project. |
| `github_link` | `Option<String>` | Deserialize with `empty_string_as_none` | The optional GitHub link of the project. |
| `url` | `Option<String>` | Deserialize with `empty_string_as_none` | The optional URL of the project. |
| `start_date` | `Option<DateTime<Utc>>` | N/A | The optional start date of the project. |
| `under_development` | The project is currently under development. |

### Project Struct

### NewProject Struct

| Field Name       | Type                                 | Validation Rules                        | Description                              |
| ---------------- | ------------------------------------ | --------------------------------------- | ---------------------------------------- |
| `id`             | `i32`                                | N/A                                     | The unique identifier of the project.    |
| `current_status` | [CurrentStatus](#currentstatus-enum) | N/A                                     | The current status of the project.       |
| `content_type`   | [ContentType](#content-type-enum)    | N/A                                     | The type of content.                     |
| `github_link`    | `Option<String>`                     | Deserialize with `empty_string_as_none` | The optional GitHub link of the project. |
| `url`            | `Option<String>`                     | Deserialize with `empty_string_as_none` | The optional URL of the project.         |
| `start_date`     | `Option<DateTime<Utc>>`              | N/A                                     | The optional start date of the project.  |
| `start_date`     | `Option<DateTime<Utc>>`              | N/A                                     | The optional start date of the project.  |

The `ExtraContent` enum represents extra content associated with a base content.

| Enum Variant               | Description                                               |
| -------------------------- | --------------------------------------------------------- | --------------------------------------- | ---------------------------------------- |
| blog([Blog](#blog-struct)) | Represents a blog content associated with a base content. |
| ----------------           | ------------------------------------                      | --------------------------------------- | ---------------------------------------- |
| `id`                       | `i32`                                                     | N/A                                     | The unique identifier of the project.    |

### NewExtraContent Enum

| `content_type` | [ContentType](#content-type-enum) | N/A | The type of content. |
| `github_link` | `Option<String>` | Deserialize with `empty_string_as_none` | The optional GitHub link of the project. |
| Enum Variant | Description |
| -------------------------------------- | ---------------------------------------------------------------- |
| blog([NewBlog](#newblog-struct)) | Represents a new blog content associated with a base content. |
| project([NewProject](#newblog-struct)) | Represents a new project content associated with a base content. |
##ExaCEum

### FullContent Struct

The`Extra`enum represents exa onent associated with a base content.
The `FullContent` struct represents a full content object that includes a base content and extra content.
| Enum Variant | Description |
| Field Name | Type | Validation Rules | Description |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------- |
| `base_content` | [Content](#content) | Must be valid according to [Content](#content) validation rules | The base content associated with the full content. |

### NewExtraContent Enum

The `NewFullContent` struct represents a new full content object that includes a new base content and new extra content.

| Field Name          | Type                                     | Validation Rules                                                                     | Description                                                 |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `new_base_content`  | [NewContent](#newcontent-struct)         | Must be valid according to [NewContent](#newcontent-struct) validation rules         | The new base content associated with the new full content.  |
| `new_extra_content` | [NewExtraContent](#newextracontent-enum) | Must be valid according to [NewExtraContent](#newextracontent-enum) validation rules | The new extra content associated with the new full content. |

pjc(Pjcblog-su)Rpssprojcabas

### FullContentList Struct

The `FullContentList` struct represents a list of full content objects along with the count of total content items without pagination.
The `FullContent` struct represents a full content object that includes a base content and extra content.
| Field Name | Type | Description |
| ------------------- | --------------------------------------- | ---------------------------------------------------- |
| `full_content_list` | Vec<[FullContent](#fullcontent-struct)> | The list of full content objects. |
| `content_count` | `i64` | The total count of content items without pagination. |
| `extra_content` | [ExtraContent](#extracontent-enum) | Must be valid according to [ExtraContent](#extracontent-enum) validation rules | The extra content associated with the full content. |

### NewFullContent Struct

### DbRows Struct

The `DbRows` struct represents a result of a database operation that indicates the number of rows affected.
NeFullContentnw flcnntbjcludaew ascntentand nextra onnt
| Field Name | Type | Description |
| --------------- | ----- | ------------------------------------------------------ |
| `new_base_content` | [NewContent](#newcontent-struct) | Must be valid according to [NewContent](#newcontent-struct) validation rules | The new base content associated with the new full content. |
| `new_extra_content` | [NewExtraContent](#newextracontent-enum) | Must be valid according to [NewExtraContent](#newextracontent-enum) validation rules | The new extra content associated with the new full content. |

### ShowOrder Enum

The `ShowOrder` enum represents different ways to order content for display.
###FllCoLitSu
| Enum Variant | Description |
| -------------------- | ------------------------------------------------------------------------- |
| `Newest` | Represents displaying content in the newest order. |
| `Oldest` | Represents displaying content in the oldest order. |
| `full_content_list` | Vec<[FullContent](#fullcontent-struct)> | The list of full content objects. |
| `content_count` | `i64` | The total count of content items without pagination. |

### PageInfo Struct

Re Data
The `PageInfo` struct represents information about pagination and content display order.

### DbRows Struct

| Field Name         | Type                         | Description                                            |
| ------------------ | ---------------------------- | ------------------------------------------------------ |
| `content_per_page` | `i64`                        | The number of content items to display per page.       |
| `page`             | `i64`                        | The current page number.                               |
| `show_order`       | [ShowOrder](#showorder-enum) | The order in which to display content.                 |
| `rows_effected`    | `i32`                        | The number of rows affected by the database operation. |

The `ContentSlug` struct represents a content slug, which is a string identifier for a specific content item.

| Field Name           | Type                                                                      | Description                                    |
| -------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- |
| `slug`               | `String`                                                                  | The string representation of the content slug. |
| -------------------- | ------------------------------------------------------------------------- |

### CountReturn Struct

| `Oldest` | Represents displaying content in the oldest order. |
| `ProjectStartNewest` | Represents displaying content in the newest order based on project start. |
| Field Name | Type | Description |
| ---------- | ----- | -------------------------------------------- |
| `count` | `i64` | The count value returned from the operation. |

### Id Struct

| Field Name | Type | Description |
| Field Name | Type | Description |
| ---------- | ----- | ------------------------------------ |
| `id` | `i32` | The identifier value for the entity. |
| `show_order` | [ShowOrder](#showorder-enum) | The order in which to display content. |

The `TagsToAdd` struct represents a list of tags to be added to a bloblog item.

| Field Name | Type          | Description                                       |
| ---------- | ------------- | ------------------------------------------------- |
| `tags`     | `Vec<String>` | The list of tags to be added to the content item. |
| ---------- | --------      | ----------------------------------------------    |
| `slug`     | `String`      | The string representation of the content slug.    |

The `DevblogTitle` struct represents the title of a development blog.

### CountReturn Struct

| Field Name | Type     | Description                                  |
| ---------- | -------- | -------------------------------------------- |
| `title`    | `String` | The title of the development blog.           |
| Field Name | Type     | Description                                  |
| ---------- | -----    | -------------------------------------------- |

The `GetSurroundingData` struct represents data used to retrieve surrounding blog items for a specific blog item.

| Field Name        | Type     | Description                                         |
| ----------------- | -------- | --------------------------------------------------- |
| `devblog_id`      | `i32`    | The identifier of the development blog.             |
| `blog_slug`       | `String` | The slug of the content item.                       |
| `direction_count` | `i64`    | The count of surrounding content items to retrieve. |
| ----------        | -----    | ------------------------------------                |
| `id`              | `i32`    | The identifier value for the entity.                |

The `SurroundingBlogs` struct represents the surrounding blogs for a specific blog item.

### TagsToAdd Struct

| Field Name | Type | Description |
| ---------- | ---- | ----------- |

| `after_blogs` | Vec<[FullContent](#fullcontent-struct)> | The list of content items that come after the specific content item. |
| ------------- | --------------------------------------- | -------------------------------------------------------------------- |

### ContentFilter Struct

### DevblogTitle Struct

| Field Name       | Type                                         | Description                                                        |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| `content_type`   | `ContentType`                                | The type of content items to retrieve.                             |
| `project_status` | Option<[CurrentStatus](#currentstatus-enum)> | The current status of the project to filter content items by.      |
| `project_blogs`  | `Option<i32>`                                | The identifier of the project to filter content items by.          |
| `blog_tag`       | `Option<String>`                             | The tag of the blog to filter content items by.                    |
| `devblog_id`     | `Option<i32>`                                | The identifier of the development blog to filter content items by. |
| `search`         | `Option<String>`                             | The search query to filter content items by.                       |

The `GetSurroundingData` struct represents data used to retrieve surrounding blog items for a specific blog item.

| Field Name | Type | Description |
| ---------- | ---- | ----------- |

### Get content

| `blog_slug` | `String` | The slug of the content item. |
| `direction_count` | `i64` | The count of surrounding content items to retrieve. |

### SurroundingBlogs Struct

Path Parameters:

The `SurroundingBlogs` struct represents the surrounding blogs for a specific blog item.

Response:

| -------------- | --------------------------------------- | --------------------------------------------------------------------- |
| `before_blogs` | Vec<[FullContent](#fullcontent-struct)> | The list of content items that come before the specific content item. |

### Get content by id

### ContentFilter Struct

The `ContentFilter` struct represents filters to be applied when retrieving a list of content.
Path Parameters:

| Field Name     | Type          | Description                            |
| -------------- | ------------- | -------------------------------------- |
| `content_type` | `ContentType` | The type of content items to retrieve. |

- [Full Content](#FullContent-Struct)
  | `project_blogs` | `Option<i32>` | The identifier of the project to filter content items by. |

### Get list of content

| `devblog_id` | `Option<i32>` | The identifier of the development blog to filter content items by. |
| `search` | `Option<String>` | The search query to filter content items by. |

## API Documentation

Query Parameters:

## Content

### Get content

- [Full Content List](#FullContentList-Struct)
  GET /content/${slug}

### Create content

Path Parameters:

- [Content Slug](#ContentSlug-Struct)
  Headers:

Response:

- [Full Content](#FullContent-Struct)

- [New Full Content](#NewFullContent-Struct)

### Get content by id

### Update content

```http
  GET /content/view-from-id/${id}
```

Headers:

- [Id](#Id-Struct)

- Old [Content Slug](#ContentSlug-Struct)

Json Body:

### Get list of content

### Delete content

```http
  GET /content/list
```

Query Parameters:

- Authorization: Admin Password
- [Page Info](#PageInfo-Struct)
- [Content Filter](#ContentFilter-Struct)

Response:
Response:

- [Full Content List](#FullContentList-Struct)

### Create content

### Get list of tags for blog

```http
  POST /content/add
```

Path Parameters:

- Authorization: Admin Password

- Array of [tags](#Tag-Struct)

## Tags

### Add tags to blog

### Update content

```http
  PUT /content/${slug}
```

- Authorization: Admin Password
  Headers:
  Path Parameters:

- Authorization: Admin Password

Json Body:

- Old [Content Slug](#ContentSlug-Struct)

````http

- [Full Content](#FullContent-Struct)

Headers:


```http
Path Parameters:

````

Headers:

### Get devblog

- Authorization: Admin Password

Path Parameters:
PahPaams:
Path Parameters:

Response:

- [Devblog](#Devblog-Struct)

### Get devblog from id

### Get list of tags for blog

```http
Path Parameters:

```

Path Parameters:

- [Devblog](#Devblog-Struct)
- [Content Slug](#ContentSlug-Struct)

### Get next and previous blogs in devblog

Response:

- Array of [tags](#Tag-Struct)

Query Parameters:

### Add tags to blog

- [Surrounding Blogs](#SurroundingBlogs-Struct)
  POST /tag/${slug}

### Create devblog

Headers:

- Authorization: Admin Password
  Headers:

Path Parameters:

- [Content Slug](#ContentSlug-Struct)

- [New Devblog](#NewDevblog-Struct)
  Json Body:

### Update devblog

- [Tags To Add](#TagsToAdd-Struct)

### Delete tags from blog

Headers:

DELETE /tag/${slug}

````


- Old [title](#DevblogTitle-Struct)

Json Body:


Path Parameters:
### Delete devblog

- [Content Slug](#ContentSlug-Struct)

## Devblog

### Get devblog

- Authorization: Admin Password
```http
Path Parameters:

- [Devblog Title](#DevblogTitle-Struct)


Path Parameters:

- [Devblog Title](#DevblogTitle-Struct)

Response:

- [Devblog](#Devblog-Struct)

### Get devblog from id

```http
  GET /devblog/view-from-id/${id}
````

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
