const { db } = require("../server");
//Login
exports.login = async (req, res) => {
  try {
    const { userid, password } = req.body;

    db.query("SELECT * FROM user WHERE userid = ?", [userid], (err, result) => {
      if (err) {
        return res.status(500).json({ msg: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const user = result[0];

      if (password === user.password) {
        return res.json({ msg: "Login successful!" });
      } else {
        return res.status(401).json({ msg: "Incorrect password" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

//ข้อมูล User
//http://localhost:5000/api/listuser?page=1&per_page=3&sort_column=id&sort_direction=desc&search=name
exports.listuser = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const per_page = parseInt(req.query.per_page);
  const sort_column = req.query.sort_column;
  const sort_direction = req.query.sort_direction;
  const search = req.query.search;

  if (isNaN(per_page) || per_page <= 0) {
    return res.status(400).json({ error: "Invalid per_page parameter" });
  }

  const start_idx = (page - 1) * per_page;
  let params = [];

  let sql = "SELECT * FROM user";

  if (search) {
    sql += " WHERE userid LIKE ?";
    params.push("%" + search + "%");
  }
  if (sort_column && sort_direction) {
    sql += ` ORDER BY ${sort_column} ${sort_direction}`;
  }
  sql += " LIMIT ?, ?";
  params.push(start_idx);
  params.push(per_page);

  db.query(sql, params, function (err, results, fields) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }

    db.query("SELECT COUNT(userid) as total FROM user", function (err, count) {
      if (err) {
        console.error("Error fetching total count:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching total count" });
      }
      const total = count[0]["total"];
      const total_pages = Math.ceil(total / per_page);
      res.json({
        page: page,
        per_page: per_page,
        total: total,
        total_pages: total_pages,
        data: results,
      });
    });
  });
};

//เรียกข้อมูลผู้ใช้ตาม ID
exports.readuser = async (req, res) => {
  const userId = req.params.userid;
  db.query("SELECT * FROM user WHERE userid = ?", userId, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json(result[0]);
      }
    }
  });
};

//เพิ่มข้อมูลผู่ใช้
exports.createUser = async (req, res, next) => {
  const { userid, password, fullname } = req.body;

  db.query(
    "INSERT INTO user (userid, password, fullname) VALUES (?, ?, ?)",
    [userid, password, fullname],
    (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ error: "Failed to create user" });
      }

      console.log("User created successfully");
      res.status(201).json({ message: "User created successfully" });
    }
  );
};

// อัพเดตข้อมูลผู้ใช้
exports.updateuser = async (req, res, next) => {
  const userId = req.params.userid;

  // console.log(userId);
  const { userid, password, fullname } = req.body;
  console.log(userId);

  db.query(
    "UPDATE user SET userid = ?, password = ?, fullname = ? WHERE userid = ?",
    [userid, password, fullname, userId],
    function (err, results, fields) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update user data" });
      }
      res.json({ message: "User updated successfully" }); //, data: results
    }
  );
};

// ลบข้อมูลผูใช้

exports.deleteuser = async (req, res) => {
  const id = req.params.userid;
  db.query("DELETE FROM user WHERE userid = ?", id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Device deleted successfully" });
    }
  });
};

//แสดงข้อมูล devices
exports.read = async (req, res) => {
  const sortDirection = req.query.sort_direction || "asc";
  db.query(
    `SELECT * FROM device ORDER BY date_stock ${sortDirection}`,
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(result);
      }
    }
  );
};  
//เรียกข้อมูลตาม ID
exports.list = async (req, res) => {
  const deviceId = req.params.id;
  db.query("SELECT * FROM device WHERE id = ?", deviceId, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Device not found" });
      } else {
        res.json(result[0]);
      }
    }
  });
};
//เพิ่มข้อมูล
exports.create = async (req, res) => {
  const device = req.body.device_id;
  const serial = req.body.serial_no;
  const brand = req.body.device_brand;
  const model = req.body.device_model;
  const name = req.body.device_name;
  const stock = req.body.date_stock;
  const expire = req.body.date_expire;
  const vender = req.body.vender;
  const status = req.body.device_status;

  db.query(
    "INSERT INTO device (device_id, serial_no, device_brand, device_model, device_name, date_stock, date_expire, vender, device_status) VALUES (?,?,?,?,?,?,?,?,?)",
    [device, serial, brand, model, name, stock, expire, vender, status],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (result.length === 0) {
          res.status(404).json({ message: "Device add successfully" });
        } else {
          res.json({ message: "Device add successfully" });
        }
      }
    }
  );
};
//อัปเดตข้อมูล
exports.update = async (req, res) => {
  const deviceId = req.params.id;
  const {
    device_id,
    serial_no,
    device_brand,
    device_model,
    device_name,
    date_stock,
    date_expire,
    vender,
    device_status,
  } = req.body;
  db.query(
    "UPDATE device SET device_id = ?, serial_no = ?, device_brand = ?, device_model = ?, device_name = ?, date_stock = ?, date_expire = ?, vender = ?, device_status = ? WHERE id = ?",
    [
      device_id,
      serial_no,
      device_brand,
      device_model,
      device_name,
      date_stock,
      date_expire,
      vender,
      device_status,
      deviceId,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Device updated successfully" });
      }
    }
  );
};
//ลบข้อมูล
exports.remove = async (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM device WHERE id = ?", id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Device deleted successfully" });
    }
  });
};

exports.search = async (req, res) => {
  const searchTerm = req.query.term;
  db.query(
    "SELECT * FROM device WHERE device_id LIKE ?",
    [`%${searchTerm}%`],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(result);
      }
    }
  );
};
