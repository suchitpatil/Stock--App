Once the server is running, you can interact with the following API endpoints:

User Authentication and Management:

For All API need to get APi structure as

E.g:-http://localhost:3000/api/auth/login


Register: POST /api/auth/register
Login: POST /api/auth/login
Get User Profile: GET /api/user/profile/:userId
Update User Profile: PUT /api/user/profile
Stock Posts Management:

Create Post: POST /api/posts
Get All Posts: GET /api/posts
Get Single Post: GET /api/posts/:postId
Delete Post: DELETE /api/posts/:postId
Comments Management:

Add Comment: POST /api/posts/:postId/comments
Delete Comment: DELETE /api/posts/:postId/comments/:commentId
Like System:

Like Post: POST /api/posts/:postId/like
Unlike Post: DELETE /api/posts/:postId/like
