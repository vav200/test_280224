import "./App.css";
import { useEffect, useState } from "react";
import md5 from "crypto-js/md5";
import { format } from "date-fns";

function App() {
  const [masids, setMasIds] = useState([]);
  const [items, setItems] = useState([]);

  const url = "https://api.valantis.store:41000/";
  const password = "Valantis";
  const dateNow = Date.now();
  const timestamp = format(dateNow, "yyyyMMdd");
  const authString = md5(`${password}_${timestamp}`).toString();

  console.log(timestamp);
  console.log(authString);

  let requestIds = {
    action: "get_ids",
    params: { offset: 10, limit: 3 },
  };

  let requestItems = {
    action: "get_items",
    params: { ids: masids },
  };

  function getData() {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authString,
      },
      body: JSON.stringify(requestIds),
    })
      .then((dat) => {
        if (!dat.ok) {
          throw new Error(`Ошибка HTTP: ${dat.status}`);
        }
        return dat.json();
      })
      .then((dat) => {
        console.log(dat);
        setMasIds(dat.result);
        if (masids) {
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Auth": authString,
            },
            body: JSON.stringify(requestItems),
          })
            .then((dat) => dat.json())
            .then((dat) => {
              console.log(dat);
              setItems(dat.result);
            });
        }
      })
      .catch((error) => {
        console.error("Ошибка запроса:", error.message);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <ul>
        <li className="zagl">
          <div className="box id">№</div>
          <div className="box name">Название</div>
          <div className="box price">Цена</div>
          <div className="box brend">Бренд</div>
        </li>
      </ul>
    </div>
  );
}

export default App;
