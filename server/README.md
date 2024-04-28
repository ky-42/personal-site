# Table of Contents

- [Running and Building](#running-and-building)
- [Environment Variables](#environment-variables)
- [Data Model](#data-model)
- [Generating Test Content](#generating-test-content)
- [API Documentation](#api-documentation)
  - [Content endpoints](#content-endpoints)
  - [Tag endpoints](#tag-endpoints)
  - [Devblog endpoints](#devblog-endpoints)
- [Data types](#data-types)

<br/>
<br/>

## Running and Building

Information for running and building is in the projects top-level README. Refer [here](../README.md#run-locally) for information on running locally and [here](../README.md#building) for information on building.

<br/>
<br/>

# Environment Variables

- POSTGRES_USER: Postgres user the server should use. Only needed if using the provided docker compose file.
- POSTGRES_PASSWORD: Password for the Postgres user. Only needed if using the provided docker compose file.
- DATABASE_URL: URL used to connect to database.
- ADMIN_PASSWORD: Password used to manage content.
- CLIENT_DOMAIN: Domain allowed through CORS. 

<br/>
<br/>

# Data Model

Each piece of content on the site is comprised of two components. The first component contains fundamental information thats shared by all content, such as title and body. This component is represented by the [Content](#content) object. The second component denotes the specific type of content, which can be either a blog or a project. This component is represented by either the [Blog](#blog) or [Project](#project) object.

Devblogs offer a means to organize a series of interconnected blogs. When you create new content with a content type of blog, you can incorporate it into a devblog. This enables you to filter blogs to include only those within the devblog and facilitates accessing the next and previous blog in the series.

Tags function similarly to how they do in most other applications. You can assign tags to content with a content type of blog, allowing you to filter blogs by selecting specific tags.

On the server side, the `content` table serves as the parent table, with both the `blog` and `project` tables acting as its children. The `blog` and `project` tables maintain a one-to-one relationship with the `content` table, utilizing the `id` and `content_type` fields as foreign keys. This means the `id` field for content and its related blog or project share the same value. This setup enforces that each piece of content is associated with either a blog or a project, but not both.

The `tags` table establishes a many-to-one relationship with the `blog` table, allowing multiple tags to be assigned to a single blog. While the `devblog` table maintains a one-to-many relationship with the `blog` table, allowing multiple blogs to be assigned to a single `devblog`. 

<br/>
<br/>

# Generating Test Content

There are two tests that can be run with `cargo test` to create test content:

- `add_test_content` - Adds 16 pieces of generated content to the database for testing purposes
- `print_json_content` - Prints a piece of generated content to the console

<br/>
<br/>

# API documentation

## Content endpoints

### Add content
Adds content to the server.

```http
POST /content/add
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Request Body**

[New Full Content](#new-full-content)

<hr/>

### Get content (slug)
Returns a piece of content who's slug matches the provided slug.

```http
GET /content/{slug}
```

**Path Parameters**

slug: Slug of the content to find.

**Response**

[Full Content](#full-content)

<hr/>

### Get content (id)
Returns a piece of content who's id matches the provided id.

```http
GET /content/view-from-id/{id}
```

**Path Parameters**

id: Id of the content to find.

**Response**

[Full Content](#full-content)

<hr/>

### List content
Returns a list of content. Query parameters are used to both filter for specific content and paginate. First filters will be applied then the content will be ordered then the remaining content will be split into pages.

Paginating works like so, if of you had content a-g and you wanted max page lengths of 2 it would be split like this: [[a, b], [c, d], [e, f], [g]]. So in this example page 1 would be [c, d]. Along with the content [c, d] this endpoint also returns the number of pages which in this example would be 4 as its (amount of content after filters / page length) rounded up.

```http
GET /content/list
```

**Query Parameters**

| Field            | Type                                                                                   | Description
|------------------|----------------------------------------------------------------------------------------|------------
| content_per_page | Integer                                                                                | Max page length. Will also be the length of the array of content returned. Must be 1 or greater.
| page             | Integer                                                                                | Page number to be returned. Starts at 0.
| ordering         | String Literal ("newest", "oldest", "project_start_newest", or "project_start_oldest") | Method to order the content. Newest and oldest order by [Contents](#content) created_at field. Project_start_x goes by [Projects](#project) start_date field and if used on blogs it will behave like regular newest and oldest. 
| content_type     | String Literal ("project" or "blog")                                                   | Filter to include only content with this content type.
| project_status   | Optional, String Literal ("under_development" or "finished")                           | Filter to include only content with this project status (if content_type filter is "blog" will do nothing).
| project_id       | Optional, Integer                                                                      | Id of a [Project](#project) used as a filter to include only content linked to the project with this specific id (if content_type filter is "project" will do nothing).
| blog_tag         | Optional, String                                                                       | Filter to include only content with this tag (if content_type filter is "project" will do nothing).
| devblog_id       | Optional, Integer                                                                      | Id of a [Devblog](#devblog) used as a filter to include only content linked to the devblog with this specific id (if content_type filter is "project" will do nothing).
| search           | Optional, String                                                                       | Filter to include only content that contains this specific substring within its title, description, tags, and/or linked devblog or project titles.

Example:
```
/content/list?content_per_page=4&page=1&ordering=newest&content_type=blog&search=help
```

**Response**

| Field             | Type                                   | Description
|-------------------|----------------------------------------|------------
| full_content_list | Array of [Full Content](#full-content) | All the content in the requested page.
| page_count        | Integer                                | Total number of pages of content there are.

Example:
```json
{
  "full_content_list": [{...}, {...}, {...}, {...}],
  "page_count": 3
}
```

<hr/>

### Update content
Updates content.

```http
PUT /content/{slug}
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Path Parameters**

slug: Slug of content to update.

**Request Body**

[Full Content](#full-content)
- Server will throw error code 400 if id or content-type is changed.

<hr/>

### Delete content
Deletes content from server.

```http
DELETE /content/{slug}
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Path Parameters**

slug: Slug of content to delete.

## Tag endpoints

### Add tags
Adds tags to a piece of content. Only works if the content has a content type of blog.

```http
POST /tag/{slug}
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Path Parameters**

slug: Slug of content to add tags to.


**Request Body**

Array of Strings. Each string representing a tag.

<hr/>

### Get tag
Gets the tags related to a piece of content.

```http
GET /tag/{slug}
```

**Path Parameters**

slug: Slug of content to get tags for.

**Response**

Array of Strings. Each string representing a tag.

<hr/>

### Delete tag
Deletes all tags a piece of content has.

```http
DELETE /tag/{slug}
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Path Parameters**

slug: Slug of content to delete all tags for.

## Devblog endpoints

### Add devblog
Adds devblog to server.

```http
POST /devblog/add
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Request Body**

[New Devblog](#new-devblog)

<hr/>

### Get devblog (title)
Returns a devblog who's title matches the provided title.

```http
GET /devblog/{title}
```

**Path Parameters**

title: Title of the devblog to return.

**Response**

[Devblog](#devblog)

<hr/>

### Get devblog (id)
Returns a devblog who's id matches the provided id.

```http
GET /devblog/view-from-id/{id}
```

**Path Parameters**

id: Id of the devblog to return.

**Response**

[Devblog](#devblog)

<hr/>

### Get next and previous blog
Given a blog gets the next and previous blogs in the devblog (ordering is chronological using [Contents](#content) created_at field).

For example imagine a devblog has content [c, h, j, i, m, q] created in that order. Then if you picked h as the pivot and wanted 1 piece of content in each direction then you would get [c] as blogs before and [j] as blogs after.

```http
GET /devblog/get-next-prev-blog
```

**Query Parameters**

| Field               | Type    | Description
|---------------------|---------|------------
| devblog_id          | Integer | Id of the devblog to get the blogs in.
| pivot_blog_slug     | String  | Slug of blog to get the surrounding blogs for (the pivot). Must be part of the provided devblog.
| neighbor_blog_count | Integer | Number of content to get in each direction. Will be length of the two arrays in response.

Example:
```
/devblog/get-next-prev-blog?devblog_id=3&blog_slug=hi&direction_count=2
```

**Response**

| Field        | Type                                   | Description
|--------------|----------------------------------------|------------
| before_blogs | Array of [Full Content](#full-content) | Blogs before pivot blog
| after_blogs  | Array of [Full Content](#full-content) | Blogs after pivot blog

Example:
```json
{
  "before_blogs": [{...}, {...}],
  "after_blogs": [{...}, {...}]
}
```

<hr/>

### Update devblog
Updates devblog.

```http
PUT /devblog/{title}
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Path Parameters**

title: Title of devblog to update.

**Request Body**

[Devblog](#devblog)
- Server will throw error code 400 if id is changed.

<hr/>

### Delete devblog
Deletes a devblog.

```http
DELETE /devblog/{title}
```

**Headers**

AUTHORIZATION: Server password configured in env file.

**Path Parameters**

title: Title of devblog to delete.

<br/>
<br/>

# Data types

## New Content
Contains the basic information needed to add any type of content to the server.

| Field        | Type                                 | Description
|--------------|--------------------------------------|------------
| content_type | String Literal ("blog" or "project") | Type of content.
| slug         | String                               | Unique identifier for the content, used in URLs. Meant as a more user friendly identifier then a number. Must have a length of at least 1 character.
| title        | String                               | Title of the content. Must have a length of at least 1 character.
| description  | Optional, String                     | Short description of the content.
| body         | String                               | The actual content in markdown format. Must have a length of at least 1 character.


Example new content:
```json
{
  "content_type": "blog",
  "slug": "making-friends",
  "title": "How To Make Friends",
  "description": "It can be tough but theres a simple solution",
  "body": "# Its simple\n\nTalk to people"
}
```

## Content
Contains the basic information for any type of content already stored by the server.

| Field        | Type                                 | Description
|--------------|--------------------------------------|------------
| id           | Integer                              | Unique identifier used by the server.
| content_type | String Literal ("blog" or "project") | Type of content.
| slug         | String                               | Unique identifier for the content used in URLs. Meant as a more user friendly identifier then a number. Will have a length of at least 1 character.
| title        | String                               | Title of the content. Will have a length of at least 1 character.
| description  | Optional, String                     | Short description of the content.
| body         | String                               | The actual content in markdown format. Will have a length of at least 1 character.
| created_at   | DateTime                             | Date content was created on server. In ISO 8601 combined date and time with time zone format.
| updated_at   | DateTime                             | Date content was last updated/modified. When unmodified this will be the same created_at. In ISO 8601 combined date and time with time zone format.

Example content:
```json
{
  "id": 42,
  "content_type": "project",
  "slug": "meaning-of-life",
  "title": "What is the meaning of life?",
  "description": "Does it matter?",
  "body": "# How to find the meaning of life?\n\nI really don't know  ...",
  "created_at": "2024-04-21 23:12:56.918889+00",
  "updated_at": "2024-04-21 23:12:56.918889+00"
}
```

## New Blog
Contains information about the blog specific parts of content needed to add a blog to the server.

| Field              | Type              | Description
|--------------------|-------------------|------------
| related_project_id | Optional, Integer | Unique identifier of project that the blog relates to. This would be the id field in the [Project](#project) or its related [Content](#content) object.
| devblog_id         | Optional, Integer | Unique identifier of devblog that blog is a part of. This would be the id field in the [Devblog](#devblog) object.

Example content:
```json
{
  "related_project_id": 90,
  "devblog_id": 55
}
```

## Blog
Contains information about the blog specific parts of content already stored on the server.

| Field              | Type                    | Description
|--------------------|-------------------------|------------
| id                 | Integer                 | Unique identifier used by the server. Will be the same as the id of the [Content](#content) this object is related to.
| content_type       | String Literal ("blog") | Type of content. 
| related_project_id | Optional, Integer       | Unique identifier of project that the blog relates to. This would be the id field in the [Project](#project) or its related [Content](#content) object.
| devblog_id         | Optional, Integer       | Unique identifier of devblog that blog is a part of. This would be the id field in the related [Devblog](#devblog) object.

Example content:
```json
{
  "id": 20,
  "content_type": "blog",
  "related_project_id": 17
}
```

## New Project
Contains information about the project specific parts of content needed to add a project to the server.

| Field          | Type                                               | Description
|----------------|----------------------------------------------------|------------
| current_status | String Literal ("under_development" or "finished") | Current status of the project.
| repository_url | Optional, String                                   | URL of the projects git repo.
| website_url    | Optional, String                                   | URL of the projects website.
| start_date     | Optional, DateTime                                 | Date the project was started. In ISO 8601 combined date and time with time zone format.

Example new project:
```json
{
  "current_status": "under_development",
  "repository_url": "https://github.com/ky-42/personal-site",
  "start_date": "2024-04-19 15:34:57.767+00"
}
```

## Project
Contains information about the project specific parts of content already stored on the server.

| Field          | Type                                               | Description
|----------------|----------------------------------------------------|------------
| id             | Integer                                            | Unique identifier used by the server. Will be the same as the id of the [Content](#content) this object is related to.
| current_status | String Literal ("under_development" or "finished") | Current status of the project.
| content_type   | String Literal ("project")                         | Type of content. 
| repository_url | Optional, String                                   | URL of the projects git repo.
| website_url    | Optional, String                                   | URL of the projects website.
| start_date     | Optional, DateTime                                 | Date the project was started. In ISO 8601 combined date and time with time zone format.

Example new project:
```json
{
  "id": 31,
  "current_status": "under_development",
  "content_type": "project",
  "repository_url": "https://github.com/ky-42/personal-site",
  "website_url": "https://kyledenief.me"
}
```

## New Full Content
Contains all the information needed to add a piece of content to the server.

| Field             | Type                                                                        | Description
|-------------------|-----------------------------------------------------------------------------|------------
| new_base_content  | [New Content](#new-content)                                                 | The basic information about the content.
| new_extra_content | {"blog": [New Blog](#new-blog)} or {"project": [New Project](#new-project)} | The type specific information about the content.

Example new full content with the content type as blog:
```json
{
  "base_content": {
    "content_type": "blog",
    "slug": "cheese",
    "...": "..."
  },
  "extra_content": {
    "blog": {}
  }
}
```

Example new full content with the content type as project:
```json
{
  "base_content": {
    "content_type": "project",
    "slug": "building-flowers",
    "...": "..."
  },
  "extra_content": {
    "project": {
      "current_status": "under-development",
      "...": "..."
    }
  }
}
```

## Full Content
Contains all the information about a piece of content already stored on the server.

| Field         | Type                                                        | Description
|---------------|-------------------------------------------------------------|------------
| base_content  | [Content](#content)                                         | The basic information about the content.
| extra_content | {"blog": [Blog](#blog)} or {"project": [Project](#project)} | The type specific information about the content.

Example full content with the content type as blog:
```json
{
  "base_content": {
    "id": 31,
    "content_type": "blog",
    "slug": "hello-world",
    "...": "..."
  },
  "extra_content": {
    "blog": {
      "id": 31,
      "content_type": "blog",
      "related_project_id": 99
    }
  }
}
```

Example full content with the content type as project:
```json
{
  "base_content": {
    "id": 122,
    "content_type": "project",
    "slug": "goodbye-world",
    "...": "..."
  },
  "extra_content": {
    "project": {
      "id": 122,
      "content_type": "project",
      "current_status": "finished",
      "...": "..."
    }
  }
}
```

## New Devblog
Contains information needed to add a devblog to the server.

| Field | Type   | Description
|-------|--------|------------
| title | String | Title of the of devblog.

Example new devblog:
```json
{
  "title": "How to start a unicorn!"
}
```

## Devblog
Contains information about a devblog already stored on the server.

| Field | Type    | Description
|-------|---------|------------
| id    | Integer | Unique identifier used by server.
| title | String  | Title of the of devblog.

Example devblog:
```json
{
  "id": 29,
  "title": "How to get rich!"
}
```
