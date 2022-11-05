import React from 'react'
import Table from 'react-bootstrap/Table'
import { MdClose } from 'react-icons/md'

import car from '../assets/images/car.png'

import { Search } from './Search'
import { Scene } from './Scene'
import { ModalBody } from './style'

export const Forest: React.FC = () => {
  return (
    <>
      <Search />
      <Scene />

      <div
        className="modal fade"
        id="tree-info-modal"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <ModalBody id="tree-info-modal-body">
              <MdClose size={24} className="cursor" id="close-modal" />
              <img src={car} alt="CAR" />

              <Table hover>
                <tbody>
                  <tr>
                    <td></td>
                    <th>Propietario: </th>
                    <td><span id="info-modal-name" /></td>
                  </tr>
                  <tr>
                    <td></td>
                    <th>Fecha de compra:</th>
                    <td><span id="info-modal-date" /></td>
                  </tr>
                  <tr>
                    <td></td>
                    <th>Modelo</th>
                    <td><span id="info-modal-model" /></td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>

          </div>
        </div>
      </div>

    </>
  )
}
