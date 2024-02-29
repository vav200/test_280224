import "./App.css";
import { useEffect, useState } from "react";
import md5 from "crypto-js/md5";
import { format } from "date-fns";

function App() {
  const [items, setItems] = useState([]);
  const [offsetItems, setOffsetItems] = useState(0);
  const [param, setParam] = useState("product");
  const [searchingText, setSearchingText] = useState("");

  const url = "https://api.valantis.store:41000/";
  const password = "Valantis";
  const dateNow = Date.now();
  const timestamp = format(dateNow, "yyyyMMdd");
  const authString = md5(`${password}_${timestamp}`).toString();

  function findItemsByParam(e) {
    let requestSearchItem = {
      action: "filter",
      params: { [param]: searchingText },
    };

    e.preventDefault();
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authString,
      },
      body: JSON.stringify(requestSearchItem),
    })
      .then((dat) => dat.json())
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
      });
  }

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

  // useEffect(() => {
  //   getData();
  // }, [offsetItems]);

  return (
    <div>
      <div className="searchBlock">
        <form className="searchBlock__form">
          <select
            className="searchBlock__item"
            defaultValue={"product"}
            onChange={(e) => setParam(e.target.value)}
          >
            <option value="product">по названию</option>
            <option value="price">по цене</option>
            <option value="brand">по бренду</option>
          </select>
          <input
            type="text"
            placeholder="введите искомый параметр"
            className="searchBlock__inp searchBlock__item"
            onChange={(e) => setSearchingText(e.target.value)}
            value={searchingText}
          />
          <input
            type="submit"
            value="найти"
            className="searchBlock__item"
            onClick={findItemsByParam}
          />
        </form>
      </div>
      <ul className="items">
        <li className="zagl">
          <div className="box id">№</div>
          <div className="box name">Название</div>
          <div className="box price">Цена</div>
          <div className="box brend">Бренд</div>
        </li>
        <li className="str">
          <div className="box id">55566</div>
          <div className="box name">Кольцо</div>
          <div className="box price">5000</div>
          <div className="box brend">Grasia</div>
        </li>
        <li className="str">
          <div className="box id">81566</div>
          <div className="box name">Подвеска</div>
          <div className="box price">3200</div>
          <div className="box brend">Jerdano</div>
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
          &#60;&#60; prev
        </span>
        <span className="next" onClick={() => setOffsetItems((x) => x + 1)}>
          next &#62;&#62;
        </span>
      </div>
    </div>
  );
}

export default App;
