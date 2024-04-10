import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table, Container, FormControl, Button, Navbar, InputGroup } from 'react-bootstrap';
import EditItemModal from "../../components/EditIEntryModal/EditEntryModal"
import Banner from '../../components/Banner/Banner'
import { requestAllItems, deleteItem, updateItemIndex, pushConfig } from '../../actions/contacts_actions';

function HomePage() {
    const defaultEntry = { hostname: "", ip_address: "192.168.", mac_address: "", description: "" }
    const [item, setItem] = useState(defaultEntry);
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState({ catagory: "hostname", asc: 1 });
    const [timer, setTimer] = useState({});
    const [shakers, setShakers] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveTimeout, setSaveTimeout] = useState(false);
    const [hostnameMatch, setHostnameMatch] = useState(false);
    const [ipMatch, setIpMatch] = useState('');
    const [macMatch, setMacMatch] = useState('');
    const [newItemId, setNewItemId] = useState('');
    const items = useSelector(state => state.entities.contacts)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(requestAllItems())
        setItem(defaultEntry)
    }, [dispatch]);

    useEffect(() => {
        highlightChanged(newItemId)
    }, [newItemId]);

    const highlightChanged = (newItemId) => {
        let newElement = document.getElementById(newItemId);
        if (newElement) {
            window.setTimeout(() => {
                newElement.classList.remove('highlightNew')
            }, 1500)
            newElement.classList.add('highlightNew')
            window.scrollTo({ top: newElement.offsetTop, behavior: 'smooth' });
            // setNewItemId('')
        }
    }

    const update = (e, field, listItem) => {
        listItem[field] = e.target.value
        if (!Object.values(items)
            .filter((entity) => {
                return !(entity.hostname === listItem.hostname &&
                    entity.ip_address === listItem.ip_address &&
                    entity.mac_address === listItem.mac_address
                    )
            })
            .some(entity => {
                if (entity.hostname === listItem.hostname && e.target.id.includes('hostname')) {
                    e.target.classList.add('form-input')
                    document.getElementById(`${entity._id} hostname`).classList.add('form-input')
                    setHostnameMatch(entity._id)
                    return true;
                }
            })) {
                if (e.target.id.includes('hostname')) {
                if (document.getElementById(`${hostnameMatch} hostname`)) {
                    document.getElementById(`${hostnameMatch} hostname`).classList.remove('form-input')
                }
                e.target.classList.remove('form-input')
            }
        }
        if (!Object.values(items)
            .filter((entity) => {
                return !(entity.hostname === listItem.hostname &&
                    entity.ip_address === listItem.ip_address &&
                    entity.mac_address === listItem.mac_address
                    
                    )
            })
            .some(entity => {
                if (entity.ip_address === listItem.ip_address && e.target.id.includes('ip_address')) {
                    e.target.classList.add('form-input')
                    document.getElementById(`${entity._id} ip_address`).classList.add('form-input')
                    setIpMatch(entity._id)
                    return true;
                }
            })) {
                if (e.target.id.includes('ip_address')) {
                    e.target.classList.remove('form-input')
                    if (document.getElementById(`${ipMatch} ip_address`)) {
                        document.getElementById(`${ipMatch} ip_address`).classList.remove('form-input')
                    }
            }
        }
        if (!Object.values(items)
            .filter((entity) => {
                return !(entity.hostname === listItem.hostname &&
                    entity.ip_address === listItem.ip_address &&
                    entity.mac_address === listItem.mac_address)
            })
            .some(entity => {
                if (entity.mac_address === listItem.mac_address && e.target.id.includes('mac_address')) {
                    e.target.classList.add('form-input')
                    document.getElementById(`${entity._id} mac_address`).classList.add('form-input')
                    setMacMatch(entity._id)
                    return true;
                }
            })) {
                if (e.target.id.includes('mac_address')) {
                    e.target.classList.remove('form-input')
                    if (document.getElementById(`${macMatch} mac_address`)) {
                        document.getElementById(`${macMatch} mac_address`).classList.remove('form-input')
                    }
            }
        }

        if (true) {
            if (timer) {
                clearTimeout(timer);
                clearTimeout(saveTimeout)
            }
            setTimer(window.setTimeout(() => {
                dispatch(updateItemIndex(listItem))
                setSaved(true)
            }, 1000))

            setSaveTimeout(window.setTimeout(() => {
                dispatch(updateItemIndex(listItem))
                setSaved(false)
                setSaveTimeout(false)
            }, 2500))
        }
    };

    const handleDeleteClick = (listItem, e) => {
        const deleteId = listItem._id
        e.persist()
        if (!e.target.className.includes("shaker")) {
            e.target.classList.add("shaker");
            setShakers({ ...shakers, deleteId: setTimeout(() => { e.target.classList.remove("shaker") }, 5000) })
        } else {
            dispatch(deleteItem(deleteId))
            clearTimeout(shakers[deleteId])
        }
    };

    const handleEditClick = (editingItem, e) => {
        e.persist()
        if (e.target.className.includes("edit")) {
            setItem(editingItem);
            setModalShow(true);
        } else if (e.target.localName === 'td') {
            e.target.classList.add("edit");
            setTimeout(() => { e.target.classList.remove("edit") }, 400)
        }
    };

    const handleTableSort = (catagory) => {
        if (catagory === sort.catagory) setSort({ catagory, asc: sort.asc * -1 })
        else setSort({ catagory, asc: 1 })
    };

    const contactFilter = (lineItem) => {
        return (
            lineItem.hostname?.toLowerCase()?.includes(filter?.toLowerCase()) ||
            lineItem.ip_address?.toLowerCase()?.includes(filter?.toLowerCase()) ||
            lineItem.mac_address?.toLowerCase()?.includes(filter?.toLowerCase()) ||
            lineItem.description?.toLowerCase()?.includes(filter?.toLowerCase())
        )
    }

    const generateItems = () => {
        let rows = [];
        Object.values(items)
            .filter(lineItem => contactFilter(lineItem))
            .sort((a, b) => {
                switch (sort.catagory) {
                    case "hostname": return a?.hostname?.localeCompare(b?.hostname) * sort.asc;
                    case "ipAddress":
                        let ipFirstSplitA = a?.ip_address?.split('.')[2]
                        while (ipFirstSplitA?.length < 3) {
                            ipFirstSplitA = "0" + ipFirstSplitA
                        }
                        let ipFirstSplitB = b?.ip_address?.split('.')[2]
                        while (ipFirstSplitB?.length < 3) {
                            ipFirstSplitB = "0" + ipFirstSplitB
                        }

                        let ipSecondSplitA = a?.ip_address?.split('.')[3]
                        while (ipSecondSplitA?.length < 3) {
                            ipSecondSplitA = "0" + ipSecondSplitA
                        }

                        let ipSecondSplitB = b?.ip_address?.split('.')[3]
                        while (ipSecondSplitB?.length < 3) {
                            ipSecondSplitB = "0" + ipSecondSplitB
                        }

                        if (ipFirstSplitA?.localeCompare(ipFirstSplitB) === 0) {
                            return ipSecondSplitA?.localeCompare(ipSecondSplitB) * sort.asc
                        } else {
                            return ipFirstSplitA?.localeCompare(ipFirstSplitB) * sort.asc
                        }
                    case "macAddress":
                        return a?.mac_address?.localeCompare(b?.mac_address) * sort.asc;
                    case "description":
                        return a?.description?.localeCompare(b?.description) * sort.asc;
                }
            })
            .forEach((listItem, idx) => {
                rows.push(
                    <tr key={listItem._id} id={listItem._id} className='table-row'>
                        <td onClick={e => { handleEditClick(listItem, e) }}>
                            <input
                                type="text"
                                className="form-control table-text-input"
                                value={listItem.hostname}
                                onChange={e => { update(e, "hostname", listItem) }}
                                id={`${listItem._id} hostname`}
                            />
                        </td>
                        <td onClick={e => { handleEditClick(listItem, e) }}>
                            <input
                                type="text"
                                id={`${listItem._id} ip_address`}
                                className="form-control table-text-input"
                                value={listItem.ip_address} onChange={e => { update(e, "ip_address", listItem) }} />
                        </td>
                        <td onClick={e => { handleEditClick(listItem, e) }}>
                            <input
                                type="text"
                                id={`${listItem._id} mac_address`}
                                className="form-control table-text-input"
                                value={listItem.mac_address} onChange={e => { update(e, "mac_address", listItem) }} />
                        </td>
                        <td onClick={e => { handleEditClick(listItem, e) }}>
                            <input
                                type="text"
                                id="description"
                                className="form-control textarea-element table-text-input"
                                value={listItem.description} onChange={e => { update(e, "description", listItem) }} />
                        </td>
                        <td>
                            <div onClick={e => { handleDeleteClick(listItem, e) }} className="trash-can-item-list"></div>
                        </td>
                    </tr>)
            })
        return rows
    };

    const generatedItems = useMemo(() => generateItems(), []);


    return (
        <Container style={{ margin: '0px', padding: '0px', minWidth: '100%', display: 'flex', justifyContent: 'center' }}>
            <Banner filter={filter} setFilter={setFilter} setModalShow={setModalShow} />
            {saveTimeout ? <div className={`alert-container ${saved ? 'fade-in' : 'fade-out'}`}>
                <div className="alert alert-primary alert-text" role="alert">
                    Saved!
                </div>
            </div> : null}

            <Table style={{ marginTop: '55px' }} bordered responsive>
                <thead>
                    <tr>
                        <th className="item-column hostname" onClick={() => { handleTableSort("hostname") }}>{`Hostname ${sort.catagory === 'hostname' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
                        <th className="item-table-header-added item-column ip-address" onClick={() => { handleTableSort("ipAddress") }}>{`IP Address ${sort.catagory === 'ipAddress' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
                        <th className="item-table-header-qty item-column mac-address" onClick={() => { handleTableSort("macAddress") }}>{`MAC Address ${sort.catagory === 'macAddress' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
                        <th className="item-column description" onClick={() => { handleTableSort("description") }}>{`Description ${sort.catagory === 'description' ? sort.asc > 0 ? "↑" : "↓" : " "}`}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {generateItems()}
                </tbody>
            </Table>
            <EditItemModal
                show={modalShow}
                item={item}
                onHide={() => setModalShow(false)}
                setNewItemId={(itemId) => setNewItemId(itemId)} />
        </Container>
    );
}

export default HomePage;