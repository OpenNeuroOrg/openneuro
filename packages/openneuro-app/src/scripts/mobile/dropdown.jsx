import React from 'react'
import styled from '@emotion/styled'

class DropdownWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      placeholder: 'Sort By...',
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

export default DropdownWrapper

// import React from 'react'
// import styled from '@emotion/styled'

// const Dropdown = styled.label`
//   display: inline-block;
//   position: relative;
//   font-weight: lighter;
//   font-size: 18px;
//   font-family: 'Open Sans', sans-serif;
//   float: right;
//   padding: 0 20px;
//   height: auto;
//   margin: 10px 0px 0px;
// `

// const Menu = styled.div`
//   display: inline-block;
//   background: #007c92;
//   color: #fff;
//   border-radius: 2px;
//   border: 0;
//   box-shadow: inset 0 0 1px 1px rgba(0, 0, 0, 0.1);
//   padding: 10px 30px 10px 20px;
//   cursor: pointer;
//   white-space: nowrap;
// `

// // :after {
// //     content: '';
// //     position: absolute;
// //     top: 50%;
// //     right: 15px;
// //     transform: translateY(-50%);
// //     width: 0;
// //     height: 0;
// //     border-left: 5px solid transparent;
// //     border-right: 5px solid transparent;
// //     border-top: 5px solid black;
// //   }

// const List = styled.ul`
//   position: absolute;
//   top: 100%;
//   padding: 0;
//   margin: 2px 0 0 0;
//   box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
//   background-color: #ffffff;
//   list-style-type: none;
//   z-index: 99999;

//   li {
//     padding: 10px 20px;
//     cursor: pointer;
//     white-space: nowrap;
//   }
// `

// const Input = styled.input`
//   display: none;
//   + .dd-menu {
//     display: none;
//   }
//   :checked + .dd-menu {
//     display: block;
//   }
// `

// class DropdownWrapper extends React.Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       placeholder: 'Sort By...',
//     }
//   }
//   onChange(){

//   }

//   render() {
//     return (
//       <div>
//         <Dropdown className="dropdown">
//           <Menu className="dd-button"></Menu>
//           <Input
//             type="checkbox"
//             value="Test"
//             onChange={this.onChange}
//             className="dd-input"
//           />
//           <List className="dd-menu">{this.props.children}</List>
//         </Dropdown>
//       </div>
//     )
//   }
// }

// export default DropdownWrapper
