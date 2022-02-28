/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* global moment */

import React from 'react';
import {
  chakra,
  Flex,
  Text,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { formatDateTime } from '../datetime_utils';

const SidePanel = ({ instance: { runId, taskId, executionDate } }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!isOpen) {
    return (
      <IconButton
        m={2}
        icon={<MdKeyboardArrowLeft size={18} />}
        aria-label="Open Details Panel"
        onClick={onOpen}
      />
    );
  }
  let title = '';
  if (runId && taskId) {
    title = (
      <>
        <chakra.span>Task Instance: </chakra.span>
        <chakra.b>{taskId}</chakra.b>
        <chakra.span> at </chakra.span>
        <chakra.b>{formatDateTime(moment.utc(executionDate))}</chakra.b>
      </>
    );
  } else if (runId) {
    title = (
      <>
        <chakra.span>Dag Run: </chakra.span>
        <chakra.b>{runId}</chakra.b>
        <chakra.span> at </chakra.span>
        <chakra.b>{formatDateTime(moment.utc(executionDate))}</chakra.b>
      </>
    );
  } else {
    title = (
      <chakra.span>Dag Details: </chakra.span>
    );
  }

  return (
    <Flex bg="gray.200" maxWidth={isOpen ? '50%' : 0} minWidth={isOpen ? 300 : 0} flexDirection="column" p={3}>
      <IconButton
        m={2}
        icon={<MdKeyboardArrowRight size={18} />}
        aria-label="Close Details Panel"
        onClick={onClose}
      />
      <Text as="h4">
        {title}
      </Text>
      <Text>
        {/* eslint-disable-next-line max-len */}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc vel risus commodo viverra maecenas accumsan. Ut porttitor leo a diam sollicitudin tempor id eu. Molestie at elementum eu facilisis sed odio morbi quis commodo. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. Est sit amet facilisis magna etiam tempor orci eu. Id semper risus in hendrerit gravida rutrum. Ac odio tempor orci dapibus ultrices in iaculis nunc. Orci nulla pellentesque dignissim enim sit amet venenatis. Tellus at urna condimentum mattis pellentesque. Egestas purus viverra accumsan in nisl nisi scelerisque. Quisque egestas diam in arcu.
      </Text>
    </Flex>
  );
};

export default SidePanel;
