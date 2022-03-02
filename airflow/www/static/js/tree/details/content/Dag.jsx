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

import React from 'react';
import {
  Text,
  Tag,
  Code,
  Flex,
  HStack,
} from '@chakra-ui/react';

import { getMetaValue } from '../../../utils';
import { useDag, useTasks } from '../../api';

const dagId = getMetaValue('dag_id');

const Dag = () => {
  const { data: dag } = useDag(dagId);
  const { data: taskData } = useTasks(dagId);
  if (!dag || !taskData) return null;
  const { tasks = [], totalEntries = '' } = taskData;
  const operators = {};
  tasks.forEach((t) => {
    if (!operators[t.classRef.className]) {
      operators[t.classRef.className] = 1;
    } else {
      operators[t.classRef.className] += 1;
    }
  });
  const {
    description, tags, fileloc, owners,
  } = dag;
  return (
    <>
      {description && <Text>{description}</Text>}
      <HStack>{tags.map((tag) => <Tag key={tag.name} size="lg">{tag.name}</Tag>)}</HStack>
      <Text>
        Relative File Location:
        {' '}
        <Code colorScheme="blackAlpha">{fileloc}</Code>
      </Text>
      <Flex>
        <Text mr={2}>Owner:</Text>
        {owners.map((o) => <Text key={o}>{o}</Text>)}
      </Flex>
      <Text>
        {totalEntries}
        {' '}
        Tasks
      </Text>
      {Object.entries(operators).map(([key, value]) => (
        <Text key={key}>
          {value}
          {' '}
          {key}
          {value > 1 && 's'}
        </Text>
      ))}
    </>
  );
};

export default Dag;
