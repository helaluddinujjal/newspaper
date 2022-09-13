var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/api', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'helaluddin1',
    database: 'newspaper'
});

// connect to database
dbConn.connect();

//admin login
app.post('/api/admin/login', function (req, res) {
    try {
        let { email, password } = req.body;

        const hashed_password = md5(password.toString())
        const sql = `SELECT * FROM admins WHERE email = ? AND password = ?`
        dbConn.query(
            sql, [email, hashed_password],
            function (err, result, fields) {
                // console.log(err)
                if (err) {
                    res.send({ status: 0, message: "Something went wrong. Please try again" });
                } else {
                    if (result.length > 0) {
                        let token = jwt.sign({ data: result }, 'secret')
                        res.send({ status: 1, data: result, token: token });
                    } else {
                        res.send({ status: 0, message: "email or password are invalid" });
                    }

                }

            })
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});

// category
// Retrieve all categories 
app.get('/api/categories', function (req, res) {
    try {
        dbConn.query('SELECT * FROM categories', function (error, results, fields) {

            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results, message: 'categories list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// Retrieve category with id 
app.get('/api/category/:id', function (req, res) {

    let category_id = req.params.id;

    if (!category_id) {
        return res.status(400).send({ status: 0, message: 'Please provide category_id' });
    }

    try {
        dbConn.query('SELECT * FROM categories where id=?', category_id, function (error, results, fields) {
            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results[0], message: 'category list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
app.get('/api/check-slug/:slug', function (req, res) {

    let slug = req.params.slug;

    if (slug) {
        try {
            dbConn.query('SELECT * FROM categories where slug=?', slug, function (error, results, fields) {
                if (error) {
                    res.send({ status: 0, message: "Something went wrong. Please try again" });
                } else {
                    if (results.length > 0) {
                        return res.send({ status: 1 });
                    } else {
                        return res.send({ status: 0 });
                    }

                }

            });
        } catch (error) {
            //res.send({ status: 0, error: error });
            return res.send({ status: 0, message: "Something went wrong. Please try again" });
        }
    }


});
// Add a new category  
app.post('/api/add-category', function (req, res) {

    let category = req.body;
    let date = new Date();
    //console.log(req.body)
    if (!category) {
        return res.status(400).send({ status: 0, message: 'Please provide category' });
    }

    try {
        dbConn.query("INSERT INTO categories (name,slug,show_nav,status,priority,time) values(?,?,?,?,?,?)", [category.name, category.slug, category.show_nav, category.status, category.priority, date], function (error, results, fields) {

            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again, " + error });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Category has been created at " + date + " created by " + category.user_name, category.user_id, date, "Category", results.insertId, category.name, "created"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Tag Inserted... Something went wrong.Log can not be loaded " + error });
                    } else {
                        return res.send({ status: 1, data: results[0], message: 'category list.' });
                    }

                });

            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Update category with id
app.patch('/api/update-category/:id', (req, res) => {

    let category_id = req.params.id;
    let category = req.body;
    let date = new Date();
    if (!category_id || !category) {
        return res.status(400).send({ status: 0, message: 'Please provide category and category_id ' + res.data });
    }

    try {
        dbConn.query("UPDATE categories SET name=?,slug=?,show_nav=?,status=?,priority=?,time=?  WHERE id = ?", [category.name, category.slug, category.show_nav, category.status, category.priority, date, category_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Categoty has been updated at " + date + " updated by " + category.user_name, category.user_id, date, "Category", category_id, category.name, "updated"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Tag Inserted... Something went wrong.Log can not be loaded " + error });
                    } else {
                        return res.send({ status: 1, data: results, message: 'category has been updated successfully.' });
                    }

                });


            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Delete category
app.delete('/api/delete-category/:id/:title/:user_id/:user_name', function (req, res) {
    let date = new Date();
    let category_id = req.params.id;
    let title = req.params.title;
    let user_id = req.params.user_id;
    let user_name = req.params.user_name;
    console.log(category_id)
    if (!category_id) {
        return res.status(400).send({ status: 0, message: 'Please provide category_id' });
    }

    try {
        dbConn.query('DELETE FROM categories WHERE id = ?', [category_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Category has been Deleted at " + date + " deleted by " + user_name, user_id, date, "Category", category_id, title, "deleted"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Category deleted... Something went wrong. " + error });
                    } else {
                        return res.send({ status: 1, data: results, message: 'Category has been updated successfully.' });
                    }

                });

            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});

// tags
// Retrieve all tags 
app.get('/api/tag-category', function (req, res) {
    try {
        dbConn.query('SELECT b.*, a.name as category FROM tags AS b LEFT JOIN categories as a ON (b.cat_id=a.id); ', function (error, results, fields) {

            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results, message: 'tag list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});

app.get('/api/tags', function (req, res) {
    try {
        dbConn.query('SELECT * FROM tags', function (error, results, fields) {

            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results, message: 'tag list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// Retrieve tags with id 
app.get('/api/tag/:id', function (req, res) {

    let tag_id = req.params.id;

    if (!tag_id) {
        return res.status(400).send({ status: 0, message: 'Please provide tag_id' });
    }

    try {
        dbConn.query('SELECT * FROM tags where id=?', tag_id, function (error, results, fields) {
            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results[0], message: 'tag list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
app.get('/api/tag/check-slug/:cat_id/:slug', function (req, res) {
    let cat_id = req.params.cat_id;
    let slug = req.params.slug;
    //console.log(cat_id+slug)
    if (slug) {
        try {
            dbConn.query('SELECT * FROM tags where cat_id=? and slug=?', [cat_id, slug], function (error, results, fields) {
                if (error) {
                    res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                } else {
                    if (results.length > 0) {
                        return res.send({ status: 1 });
                    } else {
                        return res.send({ status: 0 });
                    }

                }

            });
        } catch (error) {
            //res.send({ status: 0, error: error });
            return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
        }
    }


});
// Add a new tags  
app.post('/api/tag-create', function (req, res) {

    let tag = req.body;
    //console.log(req.body)
    let date = new Date();
    if (!tag) {
        return res.status(400).send({ status: 0, message: 'Please provide tag' });
    }

    try {
        dbConn.query("INSERT INTO tags (cat_id,name,slug,status,priority,time) values(?,?,?,?,?,?)", [tag.cat_id, tag.name, tag.slug, tag.status, tag.priority, date], function (error, results, fields) {

            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again, " + error });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Tag has been created at " + date + " created by " + tag.user_name, tag.user_id, date, "Tag", results.insertId, tag.name, "created"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Tag Inserted... Something went wrong.Log can not be loaded " + error });
                    } else {
                        return res.send({ status: 1, data: results[0], message: 'tag list.' });
                    }

                });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Update tags with id
app.put('/api/update-tag/:id', (req, res) => {

    let tag_id = req.params.id;
    let tag = req.body;
    let date = new Date;
    console.log(tag_id);
    if (!tag_id || !tag) {
        return res.status(400).send({ status: 0, message: 'Please provide tag and tag_id ' + res.data });
    }

    try {
        dbConn.query("UPDATE tags SET cat_id=?,name=?,slug=?,status=?,priority=?,time=?  WHERE id = ?", [tag.cat_id, tag.name, tag.slug, tag.status, tag.priority, date, tag_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Tag has been updated at " + date + " updated by " + tag.user_name, tag.user_id, date, "Tag", tag_id, tag.name, "updated"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Tag Inserted... Something went wrong.Log can not be loaded " + error });
                    } else {
                        return res.send({ status: 1, data: results, message: 'tag has been updated successfully.' });
                    }

                });


            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Delete tags
app.delete('/api/delete-tag/:id/:title/:user_id/:user_name', function (req, res) {
    let date = new Date();
    let tag_id = req.params.id;
    let title = req.params.title;
    let user_id = req.params.user_id;
    let user_name = req.params.user_name;
    if (!tag_id) {
        return res.status(400).send({ status: 0, message: 'Please provide tag_id' });
    }

    try {

        dbConn.query('DELETE FROM tags WHERE id = ?', [tag_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Tag has been Deleted at " + date + " deleted by " + user_name, user_id, date, "Tag", tag_id, title, "deleted"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Tag is deleted... Something went wrong. " + error });
                    } else {

                        return res.send({ status: 1, data: results, message: 'tag has been updated successfully.' });
                    }

                });

            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});


// posts
// Retrieve all posts 
app.get('/api/post-tag-category', function (req, res) {
    try {
        dbConn.query('SELECT p.*, t.name as tag,c.name as category FROM posts AS p Left JOIN categories as c ON (p.cat_id=c.id) Left JOIN tags as t ON (p.tag_id=t.id); ', function (error, results, fields) {

            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results, message: 'post list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});

app.get('/api/posts', function (req, res) {
    try {
        dbConn.query('SELECT * FROM posts', function (error, results, fields) {

            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results, message: 'post list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// Retrieve posts with id 
app.get('/api/post/:id', function (req, res) {

    let post_id = req.params.id;

    if (!post_id) {
        return res.status(400).send({ status: 0, message: 'Please provide post_id' });
    }

    try {
        dbConn.query('SELECT * FROM posts where id=?', post_id, function (error, results, fields) {
            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results[0], message: 'post details.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
app.get('/api/post/check-slug/:cat_id/:tag_id/:slug', function (req, res) {
    let cat_id = req.params.cat_id;
    let tag_id = req.params.tag_id;
    let slug = req.params.slug;
    console.log(cat_id + tag_id + slug)
    if (slug) {
        try {
            dbConn.query('SELECT * FROM posts where cat_id=? and tag_id=? and slug=?', [cat_id, tag_id, slug], function (error, results, fields) {
                if (error) {
                    res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                } else {
                    console.log(results.length)
                    if (results.length > 0) {
                        return res.send({ status: 1 });
                    } else {
                        return res.send({ status: 0 });
                    }

                }

            });
        } catch (error) {
            //res.send({ status: 0, error: error });
            return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
        }
    }


});
// Add a new posts  
app.post('/api/post-create', function (req, res) {

    let post = req.body;
    let date = new Date();
    //console.log(req.body)
    if (!post) {
        return res.status(400).send({ status: 0, message: 'Please provide post' });
    }

    try {
        dbConn.query("INSERT INTO posts (cat_id,tag_id,title,slug,content,image,featured,breaking_news,status,user_id,created_at) values(?,?,?,?,?,?,?,?,?,?,?)", [post.cat_id, post.tag_id, post.title, post.slug, post.content, post.image, post.featured, post.breaking_news, post.status, post.user_id, date], function (error, results, fields) {

            if (error) {
                console.log(error)
                return res.send({ status: 0, message: "Something went wrong. Please try again, " + error });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Post has been created at " + date + " created by " + post.user_id, post.user_id, date, "Post", results.insertId, post.title, "created"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Category Inserted... Something went wrong. " + error });
                    } else {
                        return res.send({ status: 1, data: results[0], message: 'post list.' });
                    }

                });

            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Update posts with id
app.put('/api/update-post/:id', (req, res) => {
    let date = new Date();
    let post_id = req.params.id;
    let post = req.body;
    //console.log(post_id);
    if (!post_id || !post) {
        return res.status(400).send({ status: 0, message: 'Please provide post and post_id ' + res.data });
    }

    try {
        dbConn.query("UPDATE posts SET cat_id=?,tag_id=?,title=?,slug=?,content=?,image=?,featured=?,breaking_news=?,status=?,user_id=?,updated_at=?  WHERE id = ?", [post.cat_id, post.tag_id, post.title, post.slug, post.content, post.image, post.featured, post.breaking_news, post.status, post.user_id, date, post_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Post has been updated at " + date + " updated by " + post.user_name, post.user_id, date, "Post", post_id, post.title, "updated"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Category Inserted... Something went wrong. " + error });
                    } else {
                        return res.send({ status: 1, data: results, message: 'post has been updated successfully.' });
                    }

                });

            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Delete posts
app.delete('/api/delete-post/:id/:title/:user_id/:user_name', function (req, res) {
    let date = new Date();
    let post_id = req.params.id;
    let title = req.params.title;
    let user_id = req.params.user_id;
    let user_name = req.params.user_name;
    if (!post_id) {
        return res.status(400).send({ status: 0, message: 'Please provide post_id' });
    }

    try {
        dbConn.query('DELETE FROM posts WHERE id = ?', [post_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Post has been Deleted at " + date + " deleted by " + user_name, user_id, date, "Post", post_id, title, "deleted"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Category deleted... Something went wrong. " + error });
                    } else {

                        return res.send({ status: 1, data: results, message: 'post has been deleted successfully.' });
                    }

                });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});

// pages

app.get('/api/page', function (req, res) {
    try {
        dbConn.query('SELECT * FROM dynamic_page', function (error, results, fields) {

            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results, message: 'page list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// Retrieve pages with id 
app.get('/api/page/:id', function (req, res) {

    let page_id = req.params.id;

    if (!page_id) {
        return res.status(400).send({ status: 0, message: 'Please provide page_id' });
    }

    try {
        dbConn.query('SELECT * FROM dynamic_page where id=?', page_id, function (error, results, fields) {
            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results[0], message: 'page details.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
app.get('/api/page/check-slug/:slug', function (req, res) {
    let cat_id = req.params.cat_id;
    let tag_id = req.params.tag_id;
    let slug = req.params.slug;
    console.log(cat_id + tag_id + slug)
    if (slug) {
        try {
            dbConn.query('SELECT * FROM dynamic_page where slug=?', [slug], function (error, results, fields) {
                if (error) {
                    res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                } else {
                    console.log(results.length)
                    if (results.length > 0) {
                        return res.send({ status: 1 });
                    } else {
                        return res.send({ status: 0 });
                    }

                }

            });
        } catch (error) {
            //res.send({ status: 0, error: error });
            return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
        }
    }


});
// Add a new pages  
app.post('/api/page-create', function (req, res) {

    let page = req.body;
    let date = new Date();
    //console.log(req.body)
    if (!page) {
        return res.status(400).send({ status: 0, message: 'Please provide page' });
    }

    try {
        dbConn.query("INSERT INTO dynamic_page (title,slug,content,priority,status,show_on,created_at) values(?,?,?,?,?,?,?)", [page.title, page.slug, page.content, page.priority, page.status, page.show_on, date], function (error, results, fields) {

            if (error) {
                console.log(error)
                return res.send({ status: 0, message: "Something went wrong. Please try again, " + error });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Page has been created at " + date + " created by " + page.user_id, page.user_id, date, "Page", results.insertId, page.title, "created"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Category Inserted... Something went wrong. " + error });
                    } else {
                        return res.send({ status: 1, data: results[0], message: 'page list.' });
                    }

                });

            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Update dynamic_page with id
app.put('/api/update-page/:id', (req, res) => {
    let date = new Date();
    let page_id = req.params.id;
    let page = req.body;
    console.log(page_id);
    if (!page_id || !page) {
        return res.status(400).send({ status: 0, message: 'Please provide page and page_id ' + error });
    }

    try {
        dbConn.query("UPDATE dynamic_page SET title=?,slug=?,content=?,priority=?,status=?,show_on=?,updated_at=?  WHERE id = ?", [page.title, page.slug, page.content, page.priority, page.status, page.show_on, date, page_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Page has been updated at " + date + " updated by " + page.user_name, page.user_id, date, "Page", page_id, page.title, "updated"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Category Inserted... Something went wrong. " + error });
                    } else {
                        return res.send({ status: 1, data: results, message: 'page has been updated successfully.' });
                    }

                });

            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});
//  Delete pages
app.delete('/api/delete-page/:id/:title/:user_id/:user_name', function (req, res) {
    let date = new Date();
    let page_id = req.params.id;
    let title = req.params.title;
    let user_id = req.params.user_id;
    let user_name = req.params.user_name;
    if (!page_id) {
        return res.status(400).send({ status: 0, message: 'Please provide page_id' });
    }

    try {
        dbConn.query('DELETE FROM dynamic_page WHERE id = ?', [page_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Page has been Deleted at " + date + " deleted by " + user_name, user_id, date, "Page", page_id, title, "deleted"], function (error, logs, fields) {

                    if (error) {
                        console.log(error)
                        return res.send({ status: 0, message: " Category deleted... Something went wrong. " + error });
                    } else {

                        return res.send({ status: 1, data: results, message: 'page has been deleted successfully.' });
                    }

                });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});

//dashboard
app.get('/api/count-dashboard-data', function (req, res) {
    try {
        dbConn.query('select count(id) as tot_cat from categories union all select count(id) as tot_tag from tags ', function (error, results, fields) {

            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                console.log(results)
               // return res.send({ status: 1, data: results, message: 'post list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
//  insert/Update settings with id
app.put('/api/update-site-settings', (req, res) => {
    let date = new Date();
    let settings = req.body;
    try {
        if(req.body.id){
            dbConn.query("UPDATE settings SET logo=?,footer_reserved_text=?,instagram=?,facebook=?,youtube=?,linkedin=?,twitter=?  WHERE id =1", [settings.logo, settings.footer_reserved_text, settings.instagram, settings.facebook, settings.youtube, settings.linkedin, settings.twitter], function (error, results, fields) {
                if (error) {
                    return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                } else {
                    dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Settings has been updated at " + date + " by " + settings.user_name, settings.user_id, date, "Settings", settings.id, "Site Settings", "updated"], function (error, logs, fields) {
    
                        if (error) {
                            console.log(error)
                            return res.send({ status: 0, message: " Category Inserted... Something went wrong. " + error });
                        } else {
                            return res.send({ status: 1, data: results, message: 'Settings has been saved successfully.' });
                        }
    
                    });
    
                }
    
            });
        }else{
            dbConn.query("Insert into settings(logo,footer_reserved_text,instagram,facebook,youtube,linkedin,twitter) value(?,?,?,?,?,?,?)", [settings.logo, settings.footer_reserved_text, settings.instagram, settings.facebook, settings.youtube, settings.linkedin, settings.twitter], function (error, results, fields) {
                if (error) {
                    return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                } else {
                    dbConn.query("INSERT INTO activity_logs (subject,user_id,time,type,working_id,title,action) values(?,?,?,?,?,?,?)", ["Settings has been Saved at " + date + " by " + settings.user_name, settings.user_id, date, "Settings", 1, "Site Settings", "updated"], function (error, logs, fields) {
    
                        if (error) {
                            console.log(error)
                            return res.send({ status: 0, message: " Settings Inserted... Something went wrong. " + error });
                        } else {
                            return res.send({ status: 1, data: results, message: 'Settings has been saved successfully.' });
                        }
    
                    });
    
                }
    
            });
        }
       
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again"+error });
    }
});
//site Settings
// Retrieve pages with id 
app.get('/api/get-site-settings', function (req, res) {

    try {
        dbConn.query('SELECT * FROM settings where id=?', 1, function (error, results, fields) {
            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
               // console.log(results)
                    //console.log(results)
                    return res.send({ status: 1, data: results, message: 'page details.' });
                
                
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});

// get-activity
app.get('/api/activity', function (req, res) {

    try {
        dbConn.query('SELECT * FROM activity_logs', function (error, results, fields) {
            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                return res.send({ status: 1, data: results, message: 'activity log get successfully.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
    }


});

//  Delete activity
app.delete('/api/delete-activity/:id', function (req, res) {
    let activity_id = req.params.id;
    if (!activity_id) {
        return res.status(400).send({ status: 0, message: 'Please provide activity_id' });
    }

    try {
        dbConn.query('DELETE FROM activity_logs WHERE id = ?', [activity_id], function (error, results, fields) {
            if (error) {
                return res.send({ status: 0, message: "Something went wrong. Please try again" });
            } else {
                return res.send({ status: 1, data: results, message: 'activity has been deleted successfully.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" });
    }
});

// Retrieve activity with id  and type
app.get('/api/get-activity-by-id/:id/:type', function (req, res) {

    let working_id = req.params.id;
    let type = req.params.type;
    //console.log(working_id+type)
    if (!working_id) {
        return res.status(400).send({ status: 0, message: 'Please provide working_id' });
    }

    try {
        dbConn.query('SELECT * FROM activity_logs where working_id=? and type=?', [working_id, type], function (error, results, fields) {
            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                //console.log(results)
                return res.send({ status: 1, data: results, message: 'post details.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
    }

});
// get-tags-by-cat-id
app.get('/api/get-tags-by-cat-id/:cat_id', function (req, res) {
    let cat_id = req.params.cat_id;
    // console.log(cat_id)
    if (cat_id) {
        try {
            dbConn.query('SELECT id,name FROM tags where cat_id=?', [cat_id], function (error, results, fields) {
                if (error) {
                    res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                } else {
                    return res.send({ status: 1, data: results, message: 'get tags by cat successfully.' });
                }

            });
        } catch (error) {
            //res.send({ status: 0, error: error });
            return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
        }
    }


});




// Frontend header footer
app.get('/api/frontend/page/:location', function (req, res) {
    let location = req.params.location;
    try {
        dbConn.query('SELECT * FROM dynamic_page where status=1 and show_on=? order by priority IS NULL,priority asc,created_at desc ', location, function (error, results, fields) {

            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                return res.send({ status: 1, data: results, message: 'page list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});

//show page content
app.get('/api/frontend/page/content/:slug', function (req, res) {
    let slug = req.params.slug;
    try {
        dbConn.query('SELECT * FROM dynamic_page where status=1 and slug=?  ', slug, function (error, results, fields) {

            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                return res.send({ status: 1, data: results[0], message: 'page list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

}); 

// Frontend nav Menue
app.get('/api/frontend/menu/:location', function (req, res) {
    let location = req.params.location;
    try {
        dbConn.query('SELECT * FROM categories where status=1 and show_nav=? order by priority IS NULL,priority asc,time desc ', location, function (error, results, fields) {

            if (error) {
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                return res.send({ status: 1, data: results, message: 'menu list.' });
            }

        });
    } catch (error) {
        //res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});

// Frontend tag by category 
// app.get('/api/frontend/get-tag-by-cat/:cat_slug', function (req, res) {
//     let cat_slug = req.params.cat_slug;
//     let que="SELECT  (SELECT * FROM   categories where slug=?) AS categories,(SELECT * FROM   categories where) AS tot_cat,(SELECT COUNT(*)FROM   course_table) AS tot_course"
//     //'SELECT categories.id as cat_id,categories.name as cat_name,categories.slug as cat_slug, tags.id as tag_id,tags.name as tag_name,tags.slug as tag_slug, posts.id as posts_id, posts.title as posts_title, posts.slug as posts_slug,posts.image as posts_image,posts.featured as posts_featured, posts.created_at as posts_created_at, posts.updated_at as posts_updated_at FROM categories LEFT JOIN tags ON  categories.id = tags.cat_id RIGHT JOIN posts ON posts.cat_id=categories.id where categories.slug=?  order by tags.priority IS NULL,tags.priority asc,tags.time desc,posts.created_at desc,posts.updated_at desc'
//     try {
//         dbConn.query('SELECT categories.id as cat_id,categories.name as cat_name,categories.slug as cat_slug, tags.id as tag_id,tags.name as tag_name,tags.slug as tag_slug FROM categories LEFT JOIN tags ON  categories.id = tags.cat_id where categories.slug=?  order by tags.priority IS NULL,tags.priority asc,tags.time desc',cat_slug, function (error, tags, fields) {

//             if (error) {
//                 console.error(error)
//                 res.send({ status: 0, message: "Something went wrong. Please try again"+error });
//             } else {
//                 dbConn.query('SELECT * from posts where cat_id=?',[tags[0]['cat_id']], function (error, posts, fields) {

//                     if (error) {
//                         console.error(error)
//                         res.send({ status: 0, message: "Something went wrong. Please try again"+error });
//                     } else {

//                         return res.send({ status: 1, data: {tags,posts}, message: 'menu list.' });
//                     }

//                 });

//             }

//         });
//     } catch (error) {
//         res.send({ status: 0, error: error });
//         res.send({ status: 0, message: "Something went wrong. Please try again" });
//     }

// });
app.get('/api/frontend/get-tag-by-cat/:cat_slug', function (req, res) {
    let cat_slug = req.params.cat_slug;
   try {
        dbConn.query('SELECT categories.id as cat_id,categories.name as cat_name,categories.slug as cat_slug, tags.id as tag_id,tags.name as tag_name,tags.slug as tag_slug FROM categories LEFT JOIN tags ON  categories.id = tags.cat_id  where categories.slug=?', cat_slug, function (error, tags, fields) {

            if (error) {
                console.error(error)
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                return res.send({ status: 1, data: tags, message: 'menu list.' });

            }

        });
    } catch (error) {
        res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});

//get post by cat tag
app.get('/api/frontend/get-post-by-cat/:cat_slug', function (req, res) {
    let cat_slug = req.params.cat_slug;
    try {
        dbConn.query('SELECT categories.id as cat_id,categories.name as cat_name,categories.slug as cat_slug, posts.* FROM categories JOIN posts ON  categories.id = posts.cat_id  where categories.slug=?', cat_slug, function (error, posts, fields) {

            if (error) {
                console.error(error)
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                //console.log(posts.length)
                return res.send({ status: 1, data: posts, message: 'post list.' });

            } 

        });
    } catch (error) {
        res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});

//get post detail by cat tag
app.get('/api/frontend/get-post-details-by-post-title/:post_slug', function (req, res) {
    let post_slug = req.params.post_slug;
    console.log(post_slug)
    try {
        dbConn.query('SELECT posts.*,categories.name as cat_name,categories.slug as cat_slug, tags.name as tag_name,tags.slug as tag_slug FROM posts JOIN categories ON  categories.id = posts.cat_id Join tags on tags.id = posts.tag_id where posts.slug=?', post_slug, function (error, details, fields) {

            if (error) {
                console.error(error)
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                dbConn.query('UPDATE posts SET view=? where slug=?', [details[0].view+1,post_slug], function (error, results, fields) {

                    if (error) {
                        console.error(error)
                        res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                    } else {
        
                        
                        //console.log(details)
                        return res.send({ status: 1, data: details, message: 'post details.' });
        
                    } 
        
                });

                //console.log(details[0].view)
               // return res.send({ status: 1, data: details, message: 'post list.' });

            } 

        });
    } catch (error) {
        res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// Frontend home 
app.get('/api/frontend/get-posts', function (req, res) {
    try {
        //featured
        dbConn.query('select posts.*, tags.name as tag_name,tags.slug as tag_slug,categories.name as category_name, categories.slug as category_slug from posts left join tags on posts.tag_id=tags.id left join categories on posts.cat_id=categories.id where categories.status=1 and tags.status=1 and featured=1 and posts.status=1 order by posts.updated_at desc,posts.created_at desc limit 1', function (error, featured, fields) {

            if (error) {
                console.error(error)
                return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                //posts
                dbConn.query('select posts.*, tags.name as tag_name,tags.slug as tag_slug,categories.name as category_name, categories.slug as category_slug from posts left join tags on posts.tag_id=tags.id left join categories on posts.cat_id=categories.id where categories.status=1 and tags.status=1 and posts.status=1 order by posts.updated_at desc,posts.created_at desc ', function (error, results, fields) {
                    if (error) {
                        console.error(error)
                        return res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                    } else {
                        //latest
                        dbConn.query('select posts.*, tags.name as tag_name,tags.slug as tag_slug,categories.name as category_name, categories.slug as category_slug from posts left join tags on posts.tag_id=tags.id left join categories on posts.cat_id=categories.id where categories.status=1 and tags.status=1 and posts.status=1 order by posts.created_at asc limit 5 ', function (error, latestPosts, fields) {
                            if (error) {
                                return console.error(error)
                                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                            } else {
                                //most view
                                dbConn.query('select posts.*, tags.name as tag_name,tags.slug as tag_slug,categories.name as category_name, categories.slug as category_slug from posts left join tags on posts.tag_id=tags.id left join categories on posts.cat_id=categories.id where categories.status=1 and tags.status=1 and posts.status=1 order by posts.view desc, posts.created_at desc limit 5', function (error, viewNews, fields) {
                                    if (error) {
                                        console.error(error)
                                        return     res.send({ status: 0, message: "Something went wrong. Please try again" + error });
                                    } else {
                                        return res.send({ status: 1, data: { featured, results, latestPosts, viewNews }, message: 'menu list.' });

                                    }

                                });
                            }

                        });
                        //  return res.send({ status: 1, data: {featured,results}, message: 'menu list.' });

                    }
                });

                //return res.send({ status: 1, data: results, message: 'menu list.' });

            }

        });
    } catch (error) {
        res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// Frontend home 
app.get('/api/frontend/get-breaking-news', function (req, res) {

    try {
        dbConn.query('select posts.*, tags.name as tag_name,tags.slug as tag_slug,categories.name as category_name, categories.slug as category_slug from posts left join tags on posts.tag_id=tags.id left join categories on posts.cat_id=categories.id where breaking_news=1 and categories.status=1 and tags.status=1 and posts.status=1 order by posts.created_at asc', function (error, results, fields) {
            if (error) {
                console.error(error)
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                //console.log(results.length)
                return res.send({ status: 1, data: results, message: 'menu list.' });

            }

        });
    } catch (error) {
        res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
//most-view
app.get('/api/frontend/get-view-posts', function (req, res) {

    try {
        dbConn.query('select posts.*, tags.name as tag_name,tags.slug as tag_slug,categories.name as category_name, categories.slug as category_slug from posts left join tags on posts.tag_id=tags.id left join categories on posts.cat_id=categories.id where categories.status=1 and tags.status=1 and posts.status=1 order by posts.view desc, posts.created_at desc limit 3', function (error, results, fields) {
            if (error) {
                console.error(error)
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                //console.error(results)
                return res.send({ status: 1, data: results, message: 'menu list.' });

            }

        });
    } catch (error) {
        res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// fronend site
app.get('/api/frontend/get-site-settings', function (req, res) {

    try {
        dbConn.query('select * from settings where id=1', function (error, results, fields) {
            if (error) {
                console.error(error)
                res.send({ status: 0, message: "Something went wrong. Please try again" + error });
            } else {
                //console.log(results.length)
                return res.send({ status: 1, data: results, message: 'menu list.' });
            }

        });
    } catch (error) {
        res.send({ status: 0, error: error });
        res.send({ status: 0, message: "Something went wrong. Please try again" });
    }

});
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;