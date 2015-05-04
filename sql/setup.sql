-- Database: projet_tw2
-- ----------------------

-- Type that represents Creative Common licences
CREATE TYPE cc_license_type AS (
  attribution boolean,
  share_alike boolean,
  non_commercial boolean,
  no_derivative_works boolean
);

-- Table image
CREATE TABLE image (

  id serial PRIMARY KEY,

  url text NOT NULL, -- url of the original image

  author_name varchar(70) NOT NULL, -- maybe first + last name

  author_url text, -- url of the author website (optional)

  width integer NOT NULL,
  height integer NOT NULL,

  license cc_license_type NOT NULL,

  title text NOT NULL
);

-- Table category
CREATE TABLE category (
  name varchar(30) PRIMARY KEY,
  parent_name varchar(30) REFERENCES category
);

-- Table image_category (many-to-many)
CREATE TABLE image_category (
  category_name varchar(30) REFERENCES category ON DELETE CASCADE ON UPDATE CASCADE,
  image_id serial REFERENCES image ON DELETE CASCADE ON UPDATE CASCADE,

  PRIMARY KEY (category_name, image_id)
);

-- Table image_tag
CREATE TABLE image_tag (
  tag varchar(30) NOT NULL,
  image_id serial REFERENCES image ON DELETE CASCADE ON UPDATE CASCADE,

  PRIMARY KEY (tag, image_id)
);

-- Table account (without hash for the moment)
CREATE TABLE account (
  id serial PRIMARY KEY, -- account id
  login varchar(30) UNIQUE NOT NULL,
  password varchar(50) NOT NULL
);

-- Table user_library
CREATE TABLE user_library (

  user_id serial REFERENCES account ON DELETE CASCADE ON UPDATE CASCADE,
  image_id serial REFERENCES image ON DELETE CASCADE ON UPDATE CASCADE,

  PRIMARY KEY (user_id, image_id)
);