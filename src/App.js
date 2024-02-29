import "./App.css";
import { useEffect, useState } from "react";
import md5 from "crypto-js/md5";
import { format } from "date-fns";

function App() {
  // const [masids, setMasIds] = useState([]);
  const [items, setItems] = useState([]);
  const [offsetItems, setOffsetItems] = useState(0);

  const url = "https://api.valantis.store:41000/";
  const password = "Valantis";
  const dateNow = Date.now();
  const timestamp = format(dateNow, "yyyyMMdd");
  const authString = md5(`${password}_${timestamp}`).toString();

  let requestIds = {
    action: "get_ids",
    params: { offset: offsetItems, limit: 50 },
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

        let requestItems = {
          action: "get_items",
          params: { ids: dat.result },
        };

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
      })
      .catch((error) => {
        console.error("Ошибка запроса:", error.message);
      });
  }

  useEffect(() => {
    getData();
  }, [offsetItems]);

  return (
    <div>
      <ul>
        <li className="zagl">
          <div className="box id">№</div>
          <div className="box name">Название</div>
          <div className="box price">Цена</div>
          <div className="box brend">Бренд</div>
        </li>
        {items.map((el) => (
          <li className="str">
            <div className="box id">{el.id}</div>
            <div className="box name">{el.product}</div>
            <div className="box price">{el.price}</div>
            <div className="box brend">{el.brand}</div>
          </li>
        ))}
      </ul>
      <div className="pagin">
        <span className="prev" onClick={() => setOffsetItems((x) => (x !== 0 ? x - 1 : x))}>
          prev
        </span>
        <span>&#60;&#60;|&#62;&#62;</span>
        <span className="next" onClick={() => setOffsetItems((x) => x + 1)}>
          next
        </span>
      </div>
    </div>
  );
}

export default App;
