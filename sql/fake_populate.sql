-- populate tables with test data
-- WARNING : empty table first

-- EMPTY ALL
TRUNCATE
  image, category, image_category, image_tag, account, user_library
RESTART IDENTITY CASCADE
;

-- INSERT IMAGES
INSERT INTO
  image (url, author_name, author_url, width, height, license, title)
VALUES
  ('upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
    'NASA', 'www.nasa.gov', 140, 90, (true, true, true, true), 'Jupiter')
;

INSERT INTO
  image (url, author_name, author_url, width, height, license, title)
VALUES
  ('upload.wikimedia.org/wikipedia/commons/f/f4/Saturn_false_color_Voyager-1.jpg',
    'NASA', 'www.nasa.gov', 140, 80, (false, true, true, true), 'Saturn')
;

INSERT INTO
  image (url, author_name, author_url, width, height, license, title)
VALUES
  ('http://upload.wikimedia.org/wikipedia/commons/d/df/JoeyStarr_2012.jpg',
    'Joe Star', 'www.ntm.com', 140, 80, (true, true, true, true), 'Oué gros !')
;

INSERT INTO
  image (url, author_name, author_url, width, height, license, title)
VALUES
  ('http://upload.wikimedia.org/wikipedia/commons/c/cb/Booba.jpg',
    'Booba', null, 140, 80, (true, true, true, true), 'WALA')
;



-- INSERT CATEGORIES
INSERT INTO category VALUES ('science', NULL);
INSERT INTO category VALUES ('astronomy', 'science');
INSERT INTO category VALUES ('music', NULL);
INSERT INTO category VALUES ('rap', 'music');

-- LINK CATEGORIES WITH IMAGES
INSERT INTO
  image_category
VALUES (
  'astronomy',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Jupiter')
);

INSERT INTO
  image_category
VALUES (
  'astronomy',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Saturn')
);

INSERT INTO
  image_category
VALUES (
  'science',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Saturn')
);

INSERT INTO
  image_category
VALUES (
  'rap',
  (SELECT id FROM image WHERE author_name = 'Joe Star' AND title = 'Oué gros !')
);

INSERT INTO
  image_category
VALUES (
  'rap',
  (SELECT id FROM image WHERE author_name = 'Booba')
);


-- INSERT TAGS
INSERT INTO
  image_tag
VALUES (
  'space',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Jupiter')
);
INSERT INTO
  image_tag
VALUES (
  'NASA',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Jupiter')
);
INSERT INTO
  image_tag
VALUES (
  'planet',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Jupiter')
);
INSERT INTO
  image_tag
VALUES (
  'Jupiter',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Jupiter')
);

INSERT INTO
  image_tag
VALUES (
  'planet',
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Saturn')
);

INSERT INTO
  image_tag
VALUES (
  'rap',
  (SELECT id FROM image WHERE author_name = 'Joe Star' AND title = 'Oué gros !')
);

INSERT INTO
  image_tag
VALUES (
  'rap',
  (SELECT id FROM image WHERE author_name = 'Booba')
);


-- INSERT ACCOUNTS
INSERT INTO account VALUES (DEFAULT, 'foo', 'foo');
INSERT INTO account VALUES (DEFAULT, 'bar', 'bar');
INSERT INTO account VALUES (DEFAULT, 'toto', 'toto');

-- INSERT USER LIBRARY
INSERT INTO user_library VALUES (
  (SELECT id FROM account WHERE login = 'foo'),
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Saturn')
);

INSERT INTO user_library VALUES (
  (SELECT id FROM account WHERE login = 'foo'),
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Jupiter')
);

INSERT INTO user_library VALUES (
  (SELECT id FROM account WHERE login = 'bar'),
  (SELECT id FROM image WHERE author_name = 'NASA' AND title = 'Saturn')
);

INSERT INTO user_library VALUES (
  (SELECT id FROM account WHERE login = 'bar'),
  (SELECT id FROM image WHERE author_name = 'Joe Star' AND title = 'Oué gros !')
);

