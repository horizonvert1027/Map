/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { DatePicker, Input, Select, Table as AntdTable } from 'antd';
// import { createUseStyles } from 'react-jss'

// const useStyles = createUseStyles(theme => ({

// }));

export default function Table(props) {
  // const classes = useStyles();
  const dateFormat = 'MM.DD.YYYY';
  const { columns: cols, dataSource } = props;
  const [columns, setColumns] = useState(cols);
  const [data, setData] = useState(dataSource);

  const handleFilter = options => {
    if (options.filter === 'range') {

    } else if (options.filter === 'select') {
      if (options.value) {
        setData(dataSource.filter(item => item[options.dataIndex] === options.value));
      } else {
        setData(dataSource);
      }
    } else {
      setData(dataSource.filter(item => item[options.dataIndex].toString().indexOf(options.value) > -1));
    }
  }

  const addFilters = () => {
    setColumns(cols.map(c => {
      let col = { ...c };

      if (c.filter === 'text') {
        col = {
          ...col, children: [{
            dataIndex: c.dataIndex,
            width: c.width,
            title: <Input allowClear onChange={e => handleFilter({ ...c, value: e.target.value })} />
          }]
        };
      }

      if (c.filter === 'date') {
        col = {
          ...col, children: [{
            dataIndex: c.dataIndex,
            width: c.width,
            title: <DatePicker format={dateFormat} className='w-full' />
          }]
        };
      }

      if (c.filter === 'select') {
        col = {
          ...col, children: [{
            dataIndex: c.dataIndex,
            width: c.width,
            title: <Select className='w-full' onChange={v => handleFilter({ ...c, value: v })} allowClear>
              {c.list
                ? c.list.map(item => <Select.Option key={item.id}>{item.text}</Select.Option>)
                : data.map(v => v[c.dataIndex])
                  .filter((v, i, a) => a.indexOf(v) === i && !!v)
                  .sort((a, b) => a.toString().localeCompare(b.toString()))
                  .map(v => <Select.Option key={v}>{v}</Select.Option>)
              }
            </Select>
          }]
        };
      }

      if (c.filter === 'range') {
        col = {
          ...c, children: [{
            dataIndex: c.dataIndex,
            width: c.width,
            title: <div className='d-flex'>
              <DatePicker format={dateFormat} className='d-grow mr-5' />
              <DatePicker format={dateFormat} className='d-grow' />
            </div>
          }]
        };
      }

      if (c.sorter === 'text' || c.sorter === 'date') {
        col = { ...col, sorter: (a, b) => a[col.dataIndex]?.toString().localeCompare(b[col.dataIndex]?.toString()) };
      }

      if (c.sorter === 'number') {
        col = { ...col, sorter: (a, b) => a[col.dataIndex] - b[col.dataIndex] };
      }

      return col;
    }));
  }

  useEffect(() => {
    addFilters();
  }, [cols]);


  return (
    <AntdTable {...props} columns={columns} dataSource={data} />
  );
};