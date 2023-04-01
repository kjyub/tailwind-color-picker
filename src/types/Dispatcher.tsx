import React, {useState, useEffect} from 'react'

export type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>