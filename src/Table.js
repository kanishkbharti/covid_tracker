import { AppBar } from "@material-ui/core";
import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./Common";
import ResultDialog from "./components/Features/ResultDialog";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PieChartIcon from "@material-ui/icons/PieChart";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  textStyle: {
    color: "Red"
  }
}));

const DataTable = () => {
  const [results, setResults] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [result, setResult] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const ITEMS_PER_PAGE = 30;

  const headers = [
    { name: "Country", field: "Country", sortable: true },
    { name: "Confirmed", field: "TotalConfirmed", sortable: true },
    { name: "Recovered", field: "TotalRecovered", sortable: true },
    { name: "Deaths", field: "TotalDeaths", sortable: true },
    { name: "Vizulation", field: "Viz", sortable: false }
  ];

  const classes = useStyles();

  useEffect(() => {
    const getData = () => {
      fetch("https://api.covid19api.com/summary")
        .then((response) => response.json())
        .then((json) => {
          setResults(json["Countries"]);
        });
    };

    getData();
  }, []);

  const filtered = useMemo(() => {
    let filteredResult = results;

    if (search) {
      filteredResult = filteredResult.filter((result) =>
        result["Country"].toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(filteredResult.length);

    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      console.log(results, sorting.field);
      const value = results[0][sorting.field];
      console.log(typeof value);
      if (typeof value === "string") {
        filteredResult = filteredResult.sort(
          (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
        );
      } else {
        filteredResult = filteredResult.sort((a, b) =>
          sorting.order === "asc"
            ? a[sorting.field] - b[sorting.field]
            : b[sorting.field] - a[sorting.field]
        );
      }
    }

    return filteredResult.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [results, currentPage, search, sorting]);

  const show = (c) => {
    setResult(c);
    setRedirect(true);
  };

  return (
    <>
      <div className="row w-100">
        <div className="col mb-3 col-12 text-center">
          <AppBar className={classes.appBar}>
            <Typography variant="h6" className={classes.title}>
              Covid Tracker
            </Typography>
          </AppBar>
          <div className="row mt-4 mb-4">
            <div className="col-md-6  flex-row-reverse ">
              <Search
                onSearch={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {totalItems ? (
            <>
              <table className="table table-striped">
                <TableHeader
                  headers={headers}
                  onSorting={(field, order) => setSorting({ field, order })}
                />
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r["Country"]}>
                      <td className={classes.textStyle}>{r["Country"]}</td>
                      <td>{r["TotalConfirmed"]}</td>
                      <td>{r["TotalRecovered"]}</td>
                      <td>{r["TotalDeaths"]}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => show(r)}
                        >
                          <PieChartIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row">
                <div className="col-md-6">
                  <Pagination
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </>
          ) : (
              <div className="row mt-4">
                <div className="col-md-6">
                  <h4>No result found</h4>
                </div>
              </div>
            )}
        </div>
        {redirect && <ResultDialog result={result} setRedirect={setRedirect} />}
      </div>
    </>
  );
};

export default DataTable;
