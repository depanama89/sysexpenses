CREATE TABLE tblusers (
	id SERIAL NOT NULL PRIMARY KEY,
	email VARCHAR(120) UNIQUE NOT NULL,
	firstName VARCHAR(50) NOT NULL,
	lastName VARCHAR(50),
	contact VARCHAR(15),
	password TEXT,
	country TEXT,
	createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tblroles (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE
);

CREATE TABLE tblpermissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE
);
CREATE TABLE tbluser_roles (
    user_id INT REFERENCES tblusers(id),
    role_id INT REFERENCES tblroles(id),
    PRIMARY KEY (user_id, role_id)
);
CREATE TABLE tblrole_permissions (
    role_id INT REFERENCES tblroles(id),
    permission_id INT REFERENCES tblpermissions(id),
    PRIMARY KEY (role_id, permission_id)
);
CREATE TABLE tblaccounts (
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INTEGER REFERENCES tblusers(id) ON DELETE CASCADE,
	account_name VARCHAR(50) NOT NULL,
	account_number VARCHAR(50) NOT NULL,
	account_balance NUMERIC(10, 2) NOT NULL,
	type VARCHAR(50),
	createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tblcategories (
  id SERIAL NOT NULL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,            -- ex: "Loyer", "Salaire", "Courses"
  type_categories VARCHAR(10)  NOT NULL,
   user_id INTEGER REFERENCES tblusers(id) ON DELETE CASCADE,
createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbltransaction(
	id SERIAL NOT NULL PRIMARY KEY,
	user_id INTEGER REFERENCES tblusers(id) ON DELETE CASCADE,
	description TEXT NOT NULL,
	status VARCHAR(10) NOT NULL DEFAULT 'Pending',
	 category_id INTEGER REFERENCES tblcategories(id) ON DELETE CASCADE,
  account_id  INTEGER REFERENCES tblaccounts(id) ON DELETE CASCADE,
	amount NUMERIC(10, 2) NOT NULL,
	type_transaction VARCHAR(10) NOT NULL,
	createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);